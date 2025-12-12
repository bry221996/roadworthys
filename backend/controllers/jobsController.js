const axios = require('axios');
const { User } = require('../models');
const { v4: uuidv4 } = require('uuid');

const createJob = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    // Get user and check if they have a company_id
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let companyUuid = user.company_id;

    // If user doesn't have a company_id, create a company in ServiceM8
    if (!companyUuid) {
      companyUuid = uuidv4();

      const companyResponse = await axios.post(
        'https://api.servicem8.com/api_1.0/company.json',
        {
          uuid: companyUuid,
          name: user.name
        },
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'X-Api-Key': process.env.SERVICEM8_API_KEY
          }
        }
      );

      // Save the company_id back to the user
      user.company_id = companyUuid;
      await user.save();
    }

    const jobUuid = uuidv4();

    // Create job in ServiceM8 with company_uuid
    const jobResponse = await axios.post(
      'https://api.servicem8.com/api_1.0/job.json',
      {
        uuid: jobUuid,
        status: 'Quote',
        company_uuid: companyUuid
      },
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'X-Api-Key': process.env.SERVICEM8_API_KEY
        }
      }
    );

    // Add job materials
    const materialPromises = items.map((item) =>
      axios.post(
        'https://api.servicem8.com/api_1.0/jobmaterial.json',
        {
          job_uuid: jobUuid,
          material_uuid: item.uuid,
          quantity: item.quantity,
          price: item.price,
          displayed_amount: item.price,
        },
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'X-Api-Key': process.env.SERVICEM8_API_KEY
          }
        }
      )
    );

    await Promise.all(materialPromises);

    res.json({
      success: true,
      job: jobResponse.data,
      message: 'Job created successfully'
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create job'
    });
  }
};

const listJobs = async (req, res) => {
  try {
    // Get user and their company_id
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If user doesn't have a company_id, return empty list
    if (!user.company_id) {
      return res.json({
        success: true,
        jobs: []
      });
    }

    // Fetch jobs from ServiceM8 filtered by company_uuid
    const response = await axios.get('https://api.servicem8.com/api_1.0/job.json', {
      params: {
        '$filter': `company_uuid eq '${user.company_id}'`
      },
      headers: {
        'accept': 'application/json',
        'X-Api-Key': process.env.SERVICEM8_API_KEY
      }
    });

    res.json({
      success: true,
      jobs: response.data
    });
  } catch (error) {
    console.error('List jobs error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch jobs'
    });
  }
};

const getJobDetails = async (req, res) => {
  try {
    const { uuid } = req.params;

    // Get user to verify company ownership
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Fetch job details from ServiceM8
    const jobResponse = await axios.get(`https://api.servicem8.com/api_1.0/job/${uuid}.json`, {
      headers: {
        'accept': 'application/json',
        'X-Api-Key': process.env.SERVICEM8_API_KEY
      }
    });

    // Verify the job belongs to the user's company
    if (user.company_id && jobResponse.data.company_uuid !== user.company_id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this job'
      });
    }

    // Fetch job materials
    const materialsResponse = await axios.get('https://api.servicem8.com/api_1.0/jobmaterial.json', {
      params: {
        '$filter': `job_uuid eq '${uuid}'`
      },
      headers: {
        'accept': 'application/json',
        'X-Api-Key': process.env.SERVICEM8_API_KEY
      }
    });

    res.json({
      success: true,
      job: jobResponse.data,
      materials: materialsResponse.data
    });
  } catch (error) {
    console.error('Get job details error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch job details'
    });
  }
};

const createNote = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { note } = req.body;

    if (!note || note.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Note text is required'
      });
    }

    // Get user to verify company ownership
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Fetch job to verify ownership
    const jobResponse = await axios.get(`https://api.servicem8.com/api_1.0/job/${uuid}.json`, {
      headers: {
        'accept': 'application/json',
        'X-Api-Key': process.env.SERVICEM8_API_KEY
      }
    });

    // Verify the job belongs to the user's company
    if (user.company_id && jobResponse.data.company_uuid !== user.company_id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to add note to this job'
      });
    }

    // Create note in ServiceM8
    const noteResponse = await axios.post(
      'https://api.servicem8.com/api_1.0/note.json',
      {
        related_object: 'job',
        related_object_uuid: uuid,
        note: note
      },
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'X-Api-Key': process.env.SERVICEM8_API_KEY
        }
      }
    );

    res.json({
      success: true,
      note: noteResponse.data,
      message: 'Note added successfully'
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create note'
    });
  }
};

const listNotes = async (req, res) => {
  try {
    const { uuid } = req.params;

    // Get user to verify company ownership
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Fetch job to verify ownership
    const jobResponse = await axios.get(`https://api.servicem8.com/api_1.0/job/${uuid}.json`, {
      headers: {
        'accept': 'application/json',
        'X-Api-Key': process.env.SERVICEM8_API_KEY
      }
    });

    // Verify the job belongs to the user's company
    if (user.company_id && jobResponse.data.company_uuid !== user.company_id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view notes for this job'
      });
    }

    // Fetch notes from ServiceM8
    const notesResponse = await axios.get('https://api.servicem8.com/api_1.0/note.json', {
      params: {
        '$filter': `related_object_uuid eq '${uuid}'`
      },
      headers: {
        'accept': 'application/json',
        'X-Api-Key': process.env.SERVICEM8_API_KEY
      }
    });

    res.json({
      success: true,
      notes: notesResponse.data
    });
  } catch (error) {
    console.error('List notes error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch notes'
    });
  }
};

module.exports = {
  createJob,
  listJobs,
  getJobDetails,
  createNote,
  listNotes
};
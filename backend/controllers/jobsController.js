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

module.exports = {
  createJob
};
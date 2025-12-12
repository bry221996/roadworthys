const axios = require('axios');

const listMaterials = async (req, res) => {
  try {
    const response = await axios.get('https://api.servicem8.com/api_1.0/material.json', {
        params: {
            '$filter': 'active eq 1'
        },
      headers: {
        'accept': 'application/json',
        'X-Api-Key': process.env.SERVICEM8_API_KEY
      }
    });

    res.json({
      success: true,
      materials: response.data
    });
  } catch (error) {
    console.error('List materials error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch materials from ServiceM8'
    });
  }
};

module.exports = {
  listMaterials
};
const triggerRevalidation = async (payload = {}) => {
  const endpoint = process.env.REVALIDATE_WEBHOOK_URL;
  if (!endpoint) {
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-token': process.env.REVALIDATE_WEBHOOK_TOKEN || ''
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.log(`Revalidation failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log('Revalidation error:', error.message);
  }
};

module.exports = {
  triggerRevalidation
};

import fetch from 'node-fetch';

export const generateImage = async (req, res) => {
  const prompts = req.body;

  if (!Array.isArray(prompts) || prompts.some(p => !p.prompt)) {
    return res.status(400).json({ message: 'Input must be an array of objects with a "prompt" key' });
  }

  try {
    const imageResults = await Promise.all(
      prompts.map(async (item) => {
        const response = await fetch(
          'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: item.prompt,
              options: { wait_for_model: true },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Image generation failed: ${errorData.error || response.statusText}`);
        }

        const imageBuffer = await response.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        return { image: `data:image/jpeg;base64,${base64Image}` };
      })
    );

    res.status(200).json(imageResults);
  } catch (error) {
    console.error('Error generating images:', error);
    res.status(500).json({ message: 'Server error during image generation', error: error.message });
  }
};
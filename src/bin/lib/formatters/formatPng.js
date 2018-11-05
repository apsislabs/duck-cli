export const formatPng = async (page, rendering) => {
  const { html, width, height } = rendering;
  const clip = { x: 0, y: 0, width, height };
  await page.setContent(html);
  await page.setViewport({ width, height });
  return await page.screenshot({ clip });
};

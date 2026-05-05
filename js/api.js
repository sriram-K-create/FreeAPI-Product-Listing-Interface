export async function fetchProducts() {
  const res = await fetch("https://api.freeapi.app/api/v1/public/randomproducts");
  return res.json();
}

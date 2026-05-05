import { fetchProducts } from "./api.js";

const container = document.getElementById("productContainer");
const apiMeta = document.getElementById("apiMeta");

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercentage(value) {
  return `${value.toFixed(2)}%`;
}

function getStockTone(stock) {
  if (stock >= 50) return "bg-emerald-100 text-emerald-800";
  if (stock >= 20) return "bg-amber-100 text-amber-800";
  return "bg-rose-100 text-rose-800";
}

function getStockLabel(stock) {
  if (stock >= 50) return "In stock";
  if (stock >= 20) return "Running low";
  return "Low stock";
}

function getAvailabilityText(product) {
  return `${getStockLabel(product.stock)} · ${product.stock} units`;
}

function getHeroImage(product) {
  return product.images?.[0] || product.thumbnail;
}

function renderMeta(res) {
  const meta = res.data;

  apiMeta.innerHTML = `
    <div class="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
      <div class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Page</div>
      <div class="mt-2 text-2xl font-bold text-slate-950">${meta.page} / ${meta.totalPages}</div>
    </div>
    <div class="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
      <div class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Products</div>
      <div class="mt-2 text-2xl font-bold text-slate-950">${meta.currentPageItems}</div>
      <div class="text-xs text-slate-500">of ${meta.totalItems}</div>
    </div>
    <div class="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
      <div class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Previous</div>
      <div class="mt-2 text-base font-semibold text-slate-950">${meta.previousPage ? "Available" : "None"}</div>
    </div>
    <div class="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
      <div class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Next</div>
      <div class="mt-2 text-base font-semibold text-slate-950">${meta.nextPage ? "Available" : "None"}</div>
    </div>
  `;
}

function renderImageLinks(images) {
  return images
    .map(
      (image, index) => `
        <a
          href="${image}"
          target="_blank"
          rel="noopener noreferrer"
          class="truncate rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-sky-300 hover:text-sky-700"
          title="Open image ${index + 1}"
        >
          Image ${index + 1}
        </a>
      `
    )
    .join("");
}

function renderImageGallery(images, title) {
  return images
    .map(
      (image, index) => `
        <a
          href="${image}"
          target="_blank"
          rel="noopener noreferrer"
          class="group relative block aspect-square w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300"
          title="Open ${title} image ${index + 1}"
        >
          <img
            src="${image}"
            alt="${title} image ${index + 1}"
            class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </a>
      `
    )
    .join("");
}

function renderProduct(product) {
  const card = document.createElement("article");
  card.className = "group overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-[0_15px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]";

  card.innerHTML = `
    <a href="${getHeroImage(product)}" target="_blank" rel="noopener noreferrer" class="block overflow-hidden bg-slate-100">
      <img src="${getHeroImage(product)}" alt="${product.title}" class="h-72 w-full object-contain bg-slate-50 p-4 transition duration-500 group-hover:scale-[1.02]" loading="lazy"/>
    </a>
    <div class="space-y-4 p-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">${product.category}</p>
          <h2 class="mt-1 text-xl font-bold leading-tight text-slate-950">${product.title}</h2>
        </div>
        <span class="rounded-full px-3 py-1 text-xs font-semibold ${getStockTone(product.stock)}">${getStockLabel(product.stock)}</span>
      </div>

      <p class="line-clamp-3 text-sm leading-6 text-slate-600">${product.description}</p>

      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="rounded-2xl bg-slate-50 p-3">
          <div class="text-xs uppercase tracking-[0.16em] text-slate-500">Price</div>
          <div class="mt-1 text-lg font-bold text-slate-950">${formatCurrency(product.price)}</div>
        </div>
        <div class="rounded-2xl bg-slate-50 p-3">
          <div class="text-xs uppercase tracking-[0.16em] text-slate-500">Discount</div>
          <div class="mt-1 text-lg font-bold text-emerald-700">-${formatPercentage(product.discountPercentage)}</div>
        </div>
        <div class="rounded-2xl bg-slate-50 p-3">
          <div class="text-xs uppercase tracking-[0.16em] text-slate-500">Brand</div>
          <div class="mt-1 font-semibold text-slate-900">${product.brand}</div>
        </div>
        <div class="rounded-2xl bg-slate-50 p-3">
          <div class="text-xs uppercase tracking-[0.16em] text-slate-500">Rating</div>
          <div class="mt-1 font-semibold text-slate-900">⭐ ${product.rating}</div>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 text-xs font-medium">
        <span class="rounded-full bg-slate-100 px-3 py-1 text-slate-700">ID #${product.id}</span>
        <span class="rounded-full bg-slate-100 px-3 py-1 text-slate-700">${getAvailabilityText(product)}</span>
      </div>

      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Product images</p>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">${renderImageGallery(product.images || [product.thumbnail], product.title)}</div>
      </div>

      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Image links</p>
        <div class="flex flex-wrap gap-2">${renderImageLinks(product.images)}</div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        Thumbnail: <a class="font-medium text-sky-700 underline decoration-sky-300 decoration-2 underline-offset-2" href="${product.thumbnail}" target="_blank" rel="noopener noreferrer">open original image</a>
      </div>
    </div>
  `;

  return card;
}

async function loadProducts() {
  container.innerHTML = `
    <div class="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-600">
      Loading products and image links...
    </div>
  `;

  try {
    const res = await fetchProducts();

    if (!res.success) {
      container.innerHTML = `
        <div class="col-span-full rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700">
          Failed to load products.
        </div>
      `;
      return;
    }

    renderMeta(res);
    container.innerHTML = "";

    res.data.data.forEach(product => {
      container.appendChild(renderProduct(product));
    });
  } catch (error) {
    container.innerHTML = `
      <div class="col-span-full rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700">
        Something went wrong while fetching the catalog.
      </div>
    `;
    console.error(error);
  }
}

loadProducts();

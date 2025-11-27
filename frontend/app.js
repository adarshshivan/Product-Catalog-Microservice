const API = "https://o7ghctt5vg.execute-api.ap-south-1.amazonaws.com/dev";

let isDemoMode = false;

const productList = document.getElementById("product-list");
const modal = document.getElementById("modal");
const addProductBtn = document.getElementById("addProductBtn");
const closeModal = document.getElementById("closeModal");
const productForm = document.getElementById("productForm");
const imageInput = document.getElementById("imageInput");

const updateModal = document.getElementById("updateModal");
const closeUpdateModal = document.getElementById("closeUpdateModal");
const updateForm = document.getElementById("updateForm");

const demoBanner = document.getElementById("demoBanner");

// -------------------------------------------------------
// TOAST
// -------------------------------------------------------
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 2000);
}

// -------------------------------------------------------
// DEMO MODE ACTIVATION
// -------------------------------------------------------
function enableDemoMode() {
  isDemoMode = true;

  demoBanner.style.display = "block";

  addProductBtn.classList.add("disabled");
  productForm.classList.add("disabled");

  // Disable modal close so user sees why actions won't work
  addProductBtn.onclick = () => alert("Demo Mode active. AWS backend is offline.");
}

// -------------------------------------------------------
// LOAD PRODUCTS (AWS FIRST, THEN FALLBACK)
// -------------------------------------------------------
async function loadProducts() {
  try {
    const res = await fetch(`${API}/products`, { timeout: 5000 });

    if (!res.ok) throw new Error("AWS offline");

    const data = await res.json();
    renderProducts(data.products);
    return;

  } catch (err) {
    console.warn("AWS offline → Switching to DEMO MODE");

    enableDemoMode();

    const demo = await fetch("demo-data.json");
    const data = await demo.json();

    renderProducts(data.products);
  }
}

// -------------------------------------------------------
// RENDER PRODUCTS
// -------------------------------------------------------
function renderProducts(list) {
  productList.innerHTML = "";

  list.forEach((p) => {
    productList.innerHTML += `
      <div class="card">

        ${p.imageUrl
          ? `<img src="${p.imageUrl}" />`
          : `<div class="no-image">No Image</div>`}

        <h3>${p.title}</h3>
        <p>₹${p.price}</p>
        <p class="stock">Stock: ${p.stock}</p>

        <div class="btn-row">
          <button class="update-btn" ${isDemoMode ? "disabled" : ""} onclick="openUpdateModal('${p.productId}')">
            Update
          </button>

          <button class="delete-btn" ${isDemoMode ? "disabled" : ""} onclick="deleteProduct('${p.productId}')">
            Delete
          </button>
        </div>

      </div>
    `;
  });
}

// -------------------------------------------------------
// DELETE PRODUCT (AWS ONLY)
// -------------------------------------------------------
async function deleteProduct(id) {
  if (isDemoMode) return alert("Delete disabled in Demo Mode");

  if (!confirm("Delete this product?")) return;

  await fetch(`${API}/products/${id}`, { method: "DELETE" });

  loadProducts();
  showToast("Product Deleted!");
}

// -------------------------------------------------------
// OPEN UPDATE MODAL
// -------------------------------------------------------
async function openUpdateModal(id) {
  if (isDemoMode) return alert("Update disabled in Demo Mode");

  currentUpdateId = id;

  const res = await fetch(`${API}/products/${id}`);
  const data = await res.json();

  const p = data.product;

  updateForm.title.value = p.title;
  updateForm.price.value = p.price;
  updateForm.stock.value = p.stock;
  updateForm.category.value = p.category;
  updateForm.description.value = p.description;

  updateModal.style.display = "block";
}

closeUpdateModal.onclick = () => (updateModal.style.display = "none");

// -------------------------------------------------------
// SUBMIT UPDATE
// -------------------------------------------------------
updateForm.onsubmit = async (e) => {
  e.preventDefault();

  if (isDemoMode) return alert("Update disabled in Demo Mode");

  const formData = new FormData(updateForm);

  const updateData = {
    title: formData.get("title"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    category: formData.get("category"),
    description: formData.get("description"),
  };

  await fetch(`${API}/products/${currentUpdateId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData)
  });

  updateModal.style.display = "none";
  loadProducts();
  showToast("Product Updated!");
};

// -------------------------------------------------------
// CREATE PRODUCT + IMAGE UPLOAD
// -------------------------------------------------------
productForm.onsubmit = async (e) => {
  e.preventDefault();

  if (isDemoMode) return alert("Create disabled in Demo Mode");

  const formData = new FormData(productForm);

  const product = {
    title: formData.get("title"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    category: formData.get("category"),
    description: formData.get("description")
  };

  const res = await fetch(`${API}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });

  const newProduct = await res.json();
  const productId = newProduct.product.productId;

  const file = imageInput.files[0];

  if (file) {
    const res2 = await fetch(`${API}/products/${productId}/upload-url`, {
      method: "POST"
    });

    const { uploadUrl, imageKey } = await res2.json();

    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file
    });

    await fetch(`${API}/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageKey })
    });
  }

  modal.style.display = "none";
  productForm.reset();
  loadProducts();
  showToast("Product Created!");
};

// INITIAL LOAD
loadProducts();

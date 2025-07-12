// 🔐 SYSTEM LICENCJI
const validLicenses = {
  "MOY-7DAYS-123": 7,
  "MOY-30DAYS-456": 30,
  "MOY-LIFE-999": "lifetime"
};

function isLicenseValid() {
  const stored = JSON.parse(localStorage.getItem("moyLicense"));
  if (!stored) return false;

  if (stored.type === "lifetime") return true;

  const activation = new Date(stored.date);
  const now = new Date();
  const diff = Math.floor((now - activation) / (1000 * 60 * 60 * 24)); // różnica w dniach

  return diff <= stored.days;
}

function submitLicense() {
  const key = document.getElementById("licenseInput").value.trim();
  const msg = document.getElementById("licenseMessage");

  if (!(key in validLicenses)) {
    msg.innerText = "Niepoprawny klucz licencyjny.";
    return;
  }

  const value = validLicenses[key];
  const licenseData = {
    key,
    type: value === "lifetime" ? "lifetime" : "days",
    days: value === "lifetime" ? null : value,
    date: new Date().toISOString()
  };

  localStorage.setItem("moyLicense", JSON.stringify(licenseData));
  location.reload();
}

window.onload = () => {
  if (!isLicenseValid()) {
    document.getElementById("generatorContainer").style.display = "none";
    document.getElementById("licenseContainer").style.display = "block";
  } else {
    document.getElementById("licenseContainer").style.display = "none";
    document.getElementById("generatorContainer").style.display = "block";
  }
};

// 📋 GENERATOR – LOGIKA FORMULARZA

const selector = document.querySelector(".selector_box");
selector.addEventListener("click", () => {
  selector.classList.toggle("selector_open");
});

document.querySelectorAll(".date_input").forEach((el) => {
  el.addEventListener("click", () => {
    document.querySelector(".date").classList.remove("error_shown");
  });
});

let sex = "m";
document.querySelectorAll(".selector_option").forEach((opt) => {
  opt.addEventListener("click", () => {
    sex = opt.id;
    document.querySelector(".selected_text").innerHTML = opt.innerHTML;
  });
});

const upload = document.querySelector(".upload");
const imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

document.querySelectorAll(".input_holder").forEach((holder) => {
  const input = holder.querySelector(".input");
  input.addEventListener("click", () => {
    holder.classList.remove("error_shown");
  });
});

upload.addEventListener("click", () => {
  imageInput.click();
  upload.classList.remove("error_shown");
});

imageInput.addEventListener("change", (event) => {
  upload.classList.remove("upload_loaded");
  upload.classList.add("upload_loading");
  upload.removeAttribute("selected");

  const file = imageInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const url = e.target.result;
    upload.classList.remove("error_shown");
    upload.setAttribute("selected", url);
    upload.classList.add("upload_loaded");
    upload.classList.remove("upload_loading");
    upload.querySelector(".upload_uploaded").src = url;
    upload.querySelector(".upload_uploaded").style.display = "block";
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

document.querySelector(".go").addEventListener("click", () => {
  const empty = [];
  const params = new URLSearchParams();
  params.set("sex", sex);

  // 📸 Zdjęcie
  if (!upload.hasAttribute("selected")) {
    empty.push(upload);
    upload.classList.add("error_shown");
  } else {
    params.set("image", upload.getAttribute("selected"));
  }

  // 📅 Data urodzenia
  let birthday = "";
  let dateEmpty = false;

  document.querySelectorAll(".date_input").forEach((el) => {
    birthday += "." + el.value;
    if (isEmpty(el.value)) dateEmpty = true;
  });

  birthday = birthday.substring(1);
  if (dateEmpty) {
    const dateEl = document.querySelector(".date");
    dateEl.classList.add("error_shown");
    empty.push(dateEl);
  } else {
    params.set("birthday", birthday);
  }

  // 📥 Wszystkie pola tekstowe
  document.querySelectorAll(".input_holder").forEach((holder) => {
    const input = holder.querySelector(".input");
    if (isEmpty(input.value)) {
      empty.push(holder);
      holder.classList.add("error_shown");
    } else {
      params.set(input.id, input.value);
    }
  });

  if (empty.length !== 0) {
    empty[0].scrollIntoView();
  } else {
    forwardToId(params);
  }
});

function isEmpty(value) {
  return /^\s*$/.test(value);
}

function forwardToId(params) {
  location.href = "/id?" + params;
}

// 📖 Instrukcja rozkładana
const guide = document.querySelector(".guide_holder");
guide.addEventListener("click", () => {
  guide.classList.toggle("unfolded");
});

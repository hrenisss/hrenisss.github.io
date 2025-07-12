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
  if (!(key in validLicenses)) {
    document.getElementById("licenseMessage").innerText = "Niepoprawny klucz licencyjny.";
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

// 📋 GENERATOR – ORYGINALNY KOD

var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    selector.classList.toggle("selector_open");
});

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown");
    });
});

var sex = "m";

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    });
});

var upload = document.querySelector(".upload");

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    });
});

upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown");
});

imageInput.addEventListener('change', (event) => {
    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected");

    var file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const url = e.target.result;
        upload.classList.remove("error_shown");
        upload.setAttribute("selected", url);
        upload.classList.add("upload_loaded");
        upload.classList.remove("upload_loading");
        upload.querySelector(".upload_uploaded").src = url;
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});

document.querySelector(".go").addEventListener('click', () => {
    var empty = [];
    var params = new URLSearchParams();

    params.set("sex", sex);

    if (!upload.hasAttribute("selected")) {
        empty.push(upload);
        upload.classList.add("error_shown");
    } else {
        params.set("image", upload.getAttribute("selected"));
    }

    var birthday = "";
    var dateEmpty = false;

    document.querySelectorAll(".date_input").forEach((element) => {
        birthday += "." + element.value;
        if (isEmpty(element.value)) {
            dateEmpty = true;
        }
    });

    birthday = birthday.substring(1);

    if (dateEmpty) {
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    } else {
        params.set("birthday", birthday);
    }

    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        if (isEmpty(input.value)) {
            empty.push(element);
            element.classList.add("error_shown");
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
    let pattern = /^\s*$/;
    return pattern.test(value);
}

function forwardToId(params) {
    location.href = "/id?" + params;
}

var guide = document.querySelector(".guide_holder");
guide.addEventListener('click', () => {
    guide.classList.toggle("unfolded");
});

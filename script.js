let records = [];
let items = localStorage.getItem("items");
if (!items) {
  items = [];
} else {
  items = JSON.parse(items);
}

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  let item = document.getElementById("item").value;
  let price = document.getElementById("price").value;
  let quantity = document.getElementById("quantity").value;

  // validation
  if (item.trim() == "") {
    document.getElementById("item").focus();
    return false;
  }
  if (price.trim() == "") {
    document.getElementById("price").focus();
    return false;
  }
  if (quantity.trim() == "") {
    document.getElementById("quantity").focus();
    return false;
  }

  // clear form
  document.querySelector("form").reset();

  // create object
  let record = {
    item,
    price,
    quantity,
  };

  // search if item already exists
  let found = records.find(function (r) {
    return r.item == item;
  });

  if (found) {
    if (found.price == price) {
      found.quantity = parseFloat(found.quantity) + parseFloat(quantity);
      displayRecords();
      return false;
    }
  }

  // using unshift to add to the top of the list
  records.unshift(record);
  displayRecords();

  // -------------------------
  // Update LocalStorage Memory
  let foundItem = items.find(function (record) {
    return record.item.toLowerCase() == item.toLowerCase();
  });

  if (!foundItem) {
    items.push({ item, price });
    localStorage.setItem("items", JSON.stringify(items));
  } else if (parseFloat(foundItem.price) != parseFloat(price)) {
    items.forEach(function (record) {
      if (record.item.toLowerCase() == item.toLowerCase()) {
        record.price = price;
        localStorage.setItem("items", JSON.stringify(items));
      }
    });
  }
});

function displayRecords() {
  let tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  let total = 0;
  records.forEach(function (record, index) {
    const template = document.querySelector("template").content;
    let tr = template.cloneNode(true);
    tr.querySelector(".name").textContent = record.item;
    tr.querySelector(".rate").textContent = record.price;
    tr.querySelector(".qty").textContent = record.quantity;
    tr.querySelector(".total").textContent = record.quantity * record.price;
    tr.querySelector(".count").textContent = index + 1;

    tr.querySelector(".delete").onclick = function () {
      if (!confirm("Are you sure?")) {
        return false;
      }
      records.splice(index, 1);
      displayRecords();
    };

    tr.querySelector(".edit").onclick = function () {
      document.getElementById("item").value = record.item;
      document.getElementById("price").value = record.price;
      document.getElementById("quantity").value = record.quantity;
      records.splice(index, 1);
      displayRecords();
    };

    tbody.appendChild(tr);
    total += record.quantity * record.price;
  });
  document.querySelector(".grandTotal").textContent = total;
  document.getElementById("itemTypes").textContent = records.length;
}

// sort by name
document.getElementById("sortByName").onclick = () => {
  records.sort(function (a, b) {
    if (a.item < b.item) return -1;
    else if (a.item > b.item) return 1;
    else return 0;
  });
  displayRecords();
};

// sort by rate
document.getElementById("sortByRate").onclick = () => {
  records.sort(function (a, b) {
    return parseFloat(a.price) - parseFloat(b.price);
  });
  displayRecords();
};

// sort by qty
document.getElementById("sortByQuantity").onclick = () => {
  records.sort(function (a, b) {
    return parseFloat(a.quantity) - parseFloat(b.quantity);
  });
  displayRecords();
};

// sort by total
document.getElementById("sortByTotal").onclick = () => {
  records.sort(function (a, b) {
    let totalA = parseFloat(a.quantity) * parseFloat(a.price);
    let totalB = parseFloat(b.quantity) * parseFloat(b.price);
    return totalA - totalB;
  });
  displayRecords();
};

// reverse
document.getElementById("reverse").onclick = () => {
  records.reverse();
  displayRecords();
};

// print
document.getElementById("printBtn").onclick = () => {
  window.print();
};

// clear
document.getElementById("clearBtn").onclick = () => {
  if (!confirm("Are you sure?")) {
    return false;
  }
  records = [];
  displayRecords();
};

// ------------------------
// Auto-suggestions logic
const input = document.getElementById("item");
const suggestions = document.getElementById("suggestions");

input.addEventListener("keyup", function (event) {
  let val = input.value;
  if (val.trim() == "") {
    suggestions.innerHTML = "";
    return;
  }

  if (event.key == "ArrowDown" || event.key == "ArrowUp") {
    let selected = document.querySelector("#suggestions li.selected");

    if (selected) {
      if (event.key == "ArrowDown") {
        if (selected.nextElementSibling) {
          selected.nextElementSibling.classList.add("selected");
          selected.classList.remove("selected");
        }
      } else {
        if (selected.previousElementSibling) {
          selected.previousElementSibling.classList.add("selected");
          selected.classList.remove("selected");
        }
      }
    } else {
      if (event.key == "ArrowDown") {
        let firstItem = document.querySelector("#suggestions li");
        if (firstItem) firstItem.classList.add("selected");
      }
    }
    return;
  }

  let res = items.filter(function (record) {
    return record.item.toLowerCase().includes(val.toLowerCase());
  });

  suggestions.innerHTML = "";
  res.forEach(function (suggestion) {
    let li = document.createElement("li");
    li.textContent = suggestion.item;
    li.onclick = function () {
      input.value = suggestion.item;
      document.getElementById("price").value = suggestion.price;
      document.getElementById("price").focus();
      suggestions.innerHTML = "";
    };
    suggestions.appendChild(li);
  });
});

input.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    let selected = document.querySelector("#suggestions li.selected");
    if (selected) {
      selected.click();
      event.preventDefault(); // Prevents form submission when picking a suggestion
    }
  }
});
let records = [];
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  let item = document.getElementById("item").value;
  let price = document.getElementById("price").value;
  let quantity = document.getElementById("quantity").value;

  if (item.trim() == "") {
    document.getElementById("item").focus();
    return;
  }
  if (price.trim() == "") {
    document.getElementById("price").focus();
    return;
  }
  if (quantity.trim() == "") {
    document.getElementById("quantity").focus();
    return;
  }
  document.querySelector("form").reset();
  document.getElementById("item").focus();

  let record = {
    item,
    price,
    quantity,
  };
  //push to array
  // records.push(record);

  //using unshift
  records.unshift(record);

  displayRecords();
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
      if (confirm("Are you sure?")) {
        records.splice(index, 1);
        displayRecords();
      }
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

//sort by name
document.getElementById("sortByName").onclick = () => {
  records.sort(function (a, b) {
    if (a.item < b.item) {
      return -1;
    } else if (a.item > b.item) {
      return 1;
    } else {
      return 0;
    }
  });
  displayRecords();
};

//sort by rate
document.getElementById("sortByRate").onclick = () => {
  records.sort(function (a, b) {
    a.price = parseFloat(a.price);
    b.price = parseFloat(b.price);
    return a.price - b.price;
  });
  displayRecords();
};

//sort by qty
document.getElementById("sortByQuantity").onclick = () => {
  records.sort(function (a, b) {
    a.quantity = parseFloat(a.quantity);
    b.quantity = parseFloat(b.quantity);
    return a.quantity - b.quantity;
  });
  displayRecords();
};

//sort by total
document.getElementById("sortByTotal").onclick = () => {
  records.sort(function (a, b) {
    a.total = parseFloat(a.quantity) * parseFloat(a.price);
    b.total = parseFloat(b.quantity) * parseFloat(b.price);
    return a.total - b.total;
  });
  displayRecords();
};
//reverse
document.getElementById("reverse").onclick = () => {
  records.reverse();
  displayRecords();
};

//print
document.getElementById("printBtn").onclick = () => {
  window.print();
};

//clear
document.getElementById("clearBtn").onclick = () => {
  if (confirm("Are your sure ?")) {
    records = [];
    displayRecords();
  }
};

const originalProducts = [
  {
    keywords: "New,Recommended",
    price: 3.75,
    cashback: 0.5,
    name: "Pomegranate",
    category: "Lip Care",
    description: "Lip Care",
  },
  {
    keywords: "Samples",
    price: 9.4,
    cashback: 2.5,
    name: "Grape",
    category: "Hair Care",
    description: "Hair Care",
  },
  {
    keywords: "Best Sellers,Recommended",
    price: 10.25,
    cashback: 2,
    name: "Pomegranate Lip Balm",
    category: "Hair Care",
    description: "Pomegranate Lip Balm",
  },
  {
    keywords: "Best Sellers,Samples",
    price: 13.5,
    cashback: 2.5,
    name: "Black Cherry",
    category: "Candles",
    description: "Black Cherry",
  },
  {
    keywords: "Recomended,Samples",
    price: 7.35,
    cashback: 1.5,
    name: "Pomegranate Lip Balm",
    category: "Lip Care",
    description: "Pomegranate Lip Balm",
  },
  {
    keywords: "Recommended,Samples",
    price: 1,
    cashback: 33.25,
    name: "Laundry Project",
    category: "Laundry Detergents",
    description: "Laundry Project",
  },
];

var products = originalProducts;

var currentCheckedRadio = "lowtohigh";

function renderProduction(productsArr) {
  if (currentCheckedRadio == "lowtohigh") {
    productsArr = productsArr.sort((a, b) => {
      return a.price - b.price;
    });
  } else if (currentCheckedRadio == "hightolow") {
    productsArr = productsArr.sort((a, b) => {
      return b.price - a.price;
    });
  }
  $("#products-container").html("");
  var htmlStr = "";
  productsArr.map((e) => {
    htmlStr += `
        <div class="pt-7 pb-7 px-3 rounded-xl border-2 mb-5 sm:border-color">
            <div class="text-sm text-center w-20 m-auto border-2 rounded-lg mb-7 overflow-ellipse">SVG IMG</div>
            <div class="overflow-ellipse">${e.name}</div>
            <div class="overflow-ellipse mb-1">${e.category}</div>
            <div class="text-lg font-bold mb-2">$${e.price}</div>
            <div class="text-sm"><b>$${e.cashback.toFixed(2)}</b> cashback</div>
        </div>
    `;
  });
  $("#products-container").html(htmlStr);
  $(".count-span").html(productsArr.length);
}

function toggleShow() {
  $("#mobile-filterer").slideToggle();
}

function switchRadioStatus(e) {
  $(e.target).attr("checked", "");
  var lowToHigh = $("#lowtohigh");
  var highToLow = $("#hightolow");
  if (e.target.value == "hightolow") {
    currentCheckedRadio = "hightolow";
    lowToHigh.removeAttr("checked");
  } else if (e.target.value == "lowtohigh") {
    currentCheckedRadio = "lowtohigh";
    highToLow.removeAttr("checked");
  }
}

function toggleSort(e) {
  if (currentCheckedRadio == "hightolow") {
    currentCheckedRadio = "lowtohigh";
    $(e.target).html(
      `<img src="./sort-az-svgrepo-com.svg" style="pointer-events: none;" alt="">`
    );
  } else if (currentCheckedRadio == "lowtohigh") {
    currentCheckedRadio = "hightolow";
    $(e.target).html(
      `<img src="./sort-za-svgrepo-com.svg" style="pointer-events: none;" alt="">`
    );
  }
  queryProducts();
}

function clearFilter(isMobile = false) {
  $("#search-input").val("");
  $(".category-checkbox").prop("checked", false);
  $(".tag-checkbox").prop("checked", false);
  $(".cashback-checkbox").prop("checked", false);
  $(".range-fill").css("left", "auto");
  $(".range-fill").css("width", "100%");
  $(".min-range-item").css("left", "auto");
  if (isMobile) {
    $(".max-range-item").css("left", "264px");
  } else {
    $(".max-range-item").css("left", "245px");
  }

  const range = document.querySelector(".range-selected");
  const rangeInput = document.querySelectorAll(".range-input input");
  const minRange = 1;
  const maxRange = 15;
  rangeInput[0].value = 1;
  rangeInput[1].value = 15;
  range.style.left = (minRange / rangeInput[0].max) * 100 + 2 + "%";
  range.style.right = 108 - (maxRange / rangeInput[1].max) * 100 + "%";
  renderProduction(products);
}

$(document).ready(function () {
  renderProduction(products);
  $("#sidebar-toggler").click(toggleShow);

  if (document.body.clientWidth >= 768) {
  } else {
    $("#household-wrapper").slideUp();
    $("#filter-wrapper").hide();
  }
  rangeHandle();
  attachSearchEvents();
});

function handleMoreClick() {
  var moreBtn = $("#more-btn");
  if (moreBtn.text() == "More...") {
    $("#household-wrapper").slideDown();
    $("#more-btn").text("Less...");
  } else if (moreBtn.text() == "Less...") {
    $("#household-wrapper").slideUp();
    $("#more-btn").text("More...");
  }
}

function rangeHandle() {
  let rangeMin = 1;
  const range = document.querySelector(".range-selected");
  const rangeInput = document.querySelectorAll(".range-input input");
  const rangePrice = document.querySelectorAll(".range-price input");

  rangeInput.forEach((input) => {
    input.addEventListener("input", (e) => {
      let minRange = parseInt(rangeInput[0].value);
      let maxRange = parseInt(rangeInput[1].value);
      if (maxRange - minRange < rangeMin) {
        if (e.target.className === "min") {
          rangeInput[0].value = maxRange - rangeMin;
        } else {
          rangeInput[1].value = minRange + rangeMin;
        }
      } else {
        rangePrice[0].value = minRange;
        rangePrice[1].value = maxRange;
        range.style.left = (minRange / rangeInput[0].max) * 100 + 2 + "%";
        range.style.right = 108 - (maxRange / rangeInput[1].max) * 100 + "%";
      }
      console.log(minRange, maxRange);
      queryProducts();
    });
  });
  // $(".range-input").on("mouseup", queryProducts);
}

function attachSearchEvents() {
  $("#search-input").on("keyup", function (e) {
    const val = e.target.value;
    // if (val.length > 2) queryProducts();
    queryProducts();
  });

  $(".tag-checkbox").change(queryProducts);
  $(".category-checkbox").change(queryProducts);
  $(".cashback-checkbox").change(queryProducts);
  $(".price-radio").change(queryProducts);
}

function queryProducts() {
  var result = products;
  const searchInput = $("#search-input").val();
  if (searchInput && searchInput.length > 0) {
    result = result.filter((e) => {
      return (
        e.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        e.keywords.toLowerCase().includes(searchInput.toLowerCase()) ||
        e.category.toLowerCase().includes(searchInput.toLowerCase())
      );
    });
  }

  const checkedTags = $(".tag-checkbox:checked");
  if (checkedTags.length > 0 && checkedTags.length < 4) {
    const checkedValues = checkedTags.map((k, e) => {
      return $(e).data("value");
    });
    result = result.filter((e) => {
      var flag = false;
      checkedValues.each((k, v) => {
        if (e.keywords.includes(v)) flag = true;
      });
      return flag;
    });
  }

  const checkedCategs = $(".category-checkbox:checked");
  if (checkedCategs.length > 0 && checkedCategs.length < 12) {
    const checkedValues = checkedCategs.map((k, e) => {
      return $(e).data("value");
    });
    result = result.filter((e) => {
      var flag = false;
      checkedValues.each((k, v) => {
        if (
          e.keywords.includes(v) ||
          e.category.includes(v) ||
          e.name.includes(v)
        )
          flag = true;
      });
      return flag;
    });
  }

  const rangeInput = document.querySelectorAll(".range-input input");
  const minPrice = parseInt(rangeInput[0].value);
  result = result.filter((e) => {
    return e.price >= minPrice;
  });

  const maxPrice = parseInt(rangeInput[1].value);
  result = result.filter((e) => {
    return e.price <= maxPrice;
  });

  const checkedCashbacks = $(".cashback-checkbox:checked");
  if (checkedCashbacks.length > 0 && checkedCategs.length < 3) {
    const checkedValues = checkedCashbacks.map((k, e) => {
      return $(e).data("value");
    });
    result = result.filter((e) => {
      var flag = false;
      checkedValues.each((k, v) => {
        const d = v.split("-");
        if (e.cashback >= parseInt(d[0]) && e.cashback <= parseInt(d[1]))
          flag = true;
      });
      return flag;
    });
  }

  if (this.value == "lowtohigh") {
    result.sort((a, b) => {
      return a.price - b.price;
    });
  } else if (this.value == "hightolow") {
    result.sort((a, b) => {
      return b.price - a.price;
    });
  }

  renderProduction(result);
}

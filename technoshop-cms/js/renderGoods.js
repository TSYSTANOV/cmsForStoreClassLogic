import { API_component } from "./api.js";
class Goods {
  ROOT_element;
  pageTotal;
  page_number = 1;
  constructor(root) {
    this.ROOT_element = root;
  }
  async renderGoods(rootElement = "tbody") {
    if (rootElement === "tbody") {
      document.querySelector(rootElement).innerHTML = "";
    }
    const dataGoods = await API_component.getAllGoods(this.page_number);
    this.pageTotal = dataGoods.pages;
    const goods = dataGoods.goods.map((elem) => {
      const item = document.createElement("tr");
      item.className = "table-row table-goods-item";
      item.dataset.id = elem.id;
      item.innerHTML = `
        <td>${elem.id}</td>
        <td>${elem.title}</td>
        <td>${elem.category}</td>
        <td class="text-end">${elem.price} &#8381;</td>
        <td class="d-flex">
          <button class="btn-table btn-delete">
            <svg width="30" height="30">
              <use xlink:href="#delete" />
            </svg>
          </button>
        </td>
        `;
      return item;
    });
    if (rootElement === "tbody") {
      document.querySelector(rootElement).append(...goods);
    } else {
      rootElement.append(...goods);
      this.createPagination();
    }
  }

  createPagination() {
    const pagination = document.createElement("nav");
    pagination.setAttribute("aria-label", "Page navigation example");
    const ul = document.createElement("ul");
    ul.className = "pagination justify-content-center";
    const btnPrev = document.createElement("li");
    btnPrev.className = "page-item direction-prev disabled";
    btnPrev.innerHTML = `<a class="page-link">Previous</a>`;

    const pages = this.renderPages();

    const btnNext = document.createElement("li");
    btnNext.className = "page-item direction-next";
    btnNext.innerHTML = `<a class="page-link" href="#">Next</a>`;
    pagination.addEventListener("click", () => {
      if(event.target.dataset.page){
        pagination
          .querySelector(`[data-page="${this.page_number}"]`)
          .parentNode.classList.remove("active");        
        event.target.parentNode.classList.add("active");
        this.page_number = +event.target.dataset.page
        if(this.page_number > 1){
          pagination
          .querySelector(".direction-prev")
          .classList.remove("disabled");
        }else{
          pagination
          .querySelector(".direction-prev")
          .classList.add("disabled");
        }
        if(this.page_number === this.pageTotal){
          pagination
          .querySelector(".direction-next")
          .classList.add("disabled");
        }else{
          pagination
          .querySelector(".direction-next")
          .classList.remove("disabled");
        }
        this.renderGoods();
      }
      if (event.target.parentNode.classList.contains("direction-next")) {
        pagination
          .querySelector(".direction-prev")
          .classList.remove("disabled");

        pagination
          .querySelector(`[data-page="${this.page_number}"]`)
          .parentNode.classList.remove("active");
        this.page_number += 1;
        if (pagination.querySelector(`[data-page="${this.page_number}"]`)) {
          pagination
            .querySelector(`[data-page="${this.page_number}"]`)
            .parentNode.classList.add("active");
          if (this.page_number === this.pageTotal) {
            pagination
              .querySelector(".direction-next")
              .classList.add("disabled");
          }
        } else {
          pagination
            .querySelector(".direction-prev")
            .after(...this.renderPages(this.page_number));
        }
        this.renderGoods();
      }
      if (event.target.parentNode.classList.contains("direction-prev")) {
        pagination
          .querySelector(".direction-next")
          .classList.remove("disabled");
        pagination
          .querySelector(`[data-page="${this.page_number}"]`)
          .parentNode.classList.remove("active");
        this.page_number -= 1;
        if (pagination.querySelector(`[data-page="${this.page_number}"]`)) {
          pagination
            .querySelector(`[data-page="${this.page_number}"]`)
            .parentNode.classList.add("active");
        } else {
          pagination
            .querySelector(".direction-next")
            .before(...this.renderPages(this.page_number, "left"));
        }

        if (this.page_number === 1) {
          pagination.querySelector(".direction-prev").classList.add("disabled");
        }
        this.renderGoods();
      }
    });

    ul.append(btnPrev, ...pages, btnNext);

    pagination.append(ul);
    document.querySelector(this.ROOT_element).append(pagination);
  }
  renderPages(startPage = 1, direction = "right") {
    if (document.querySelectorAll("[data-page]").length !== 0) {
      document.querySelectorAll("[data-page]").forEach((el) => {
        el.parentNode.remove();
      });
    }
    const pages = [];
    if (direction === "right") {
      if (this.pageTotal >= 3 && this.pageTotal - startPage >= 3) {
        let number =
          this.pageTotal - startPage >= 3 ? 3 : this.pageTotal - startPage;
        for (let i = startPage; i <= number; i++) {
          const pageNumb = document.createElement("li");
          pageNumb.className = `page-item ${i === 1 ? "active" : ""}`;
          pageNumb.innerHTML = `<a class="page-link" data-page="${i}" href="#"> ${i}</a>`;
          pages.push(pageNumb);
        }
      } else {
        for (
          let i = startPage;
          i <= this.pageTotal - startPage + startPage;
          i++
        ) {
          const pageNumb = document.createElement("li");
          pageNumb.className = `page-item ${
            i === startPage || i === 1 ? "active" : ""
          }`;
          pageNumb.innerHTML = `<a class="page-link" data-page="${i}" href="#">${i}</a>`;
          pages.push(pageNumb);
          console.log(pages);
        }
      }
    } else {
      if (this.pageTotal >= 3 && this.pageTotal - startPage >= 3) {
        for (let i = startPage; i > 0; i--) {
          const pageNumb = document.createElement("li");
          pageNumb.className = `page-item ${i === startPage ? "active" : ""}`;
          pageNumb.innerHTML = `<a class="page-link" data-page="${i}" href="#"> ${i}</a>`;
          pages.push(pageNumb);
        }
      }
      //   else {
      //     for (
      //       let i = startPage;
      //       i <= this.pageTotal - startPage + startPage;
      //       i++
      //     ) {
      //       const pageNumb = document.createElement("li");
      //       pageNumb.className = `page-item ${
      //         i === startPage || i === 1 ? "active" : ""
      //       }`;
      //       pageNumb.innerHTML = `<a class="page-link" data-page="${i}" href="#">${i}</a>`;
      //       pages.push(pageNumb);
      //     }
      //   }
    }
    if (direction === "left") {
      return pages.reverse();
    }
    return pages;
  }
}

const GOODS_component = new Goods(".table-responsive");
export { GOODS_component };

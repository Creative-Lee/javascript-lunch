const RestaurantAddForm = {
  getTemplate() {
    return `
      <h2 class="modal-title text-title">새로운 음식점</h2>
      <form id="add-restaurant-form">
        <!-- 카테고리 -->
        <div id="form-category-container" class="form-category-container form-item form-item--required">
          <label for="category text-caption">카테고리</label>
        </div>

        <!-- 음식점 이름 -->
        <div class="form-item form-item--required">
          <label for="name text-caption">이름</label>
          <input type="text" name="name" id="name" required />
        </div>

        <!-- 거리 -->
        <div id="form-distance-container" class="form-distance-container form-item form-item--required">
          <label for="distance text-caption">거리(도보 이동 시간) </label>
        </div>

        <!-- 설명 -->
        <div class="form-item">
          <label for="description text-caption">설명</label>
          <textarea name="description" id="description" cols="30" rows="5"></textarea>
          <span class="help-text text-caption">메뉴 등 추가 정보를 입력해 주세요.</span>
        </div>

        <!-- 링크 -->
        <div class="form-item">
          <label for="link text-caption">참고 링크</label>
          <input type="text" name="link" id="link" />
          <span class="help-text text-caption"
            >매장 정보를 확인할 수 있는 링크를 입력해 주세요.</span
          >
        </div>

        <!-- 취소/추가 버튼 -->
        <div class="button-container">
          <button
            type="button"
            id="form-modal-close-button"
            class="button button--secondary text-caption"
          >
            취소하기
          </button>
          <button class="button button--primary text-caption">추가하기</button>
        </div>
      </form>
    `;
  },
};

export default RestaurantAddForm;

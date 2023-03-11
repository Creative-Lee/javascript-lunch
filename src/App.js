import RestaurantList from './components/RestaurantList';
import Modal from './components/Modal';
import CategorySelectBox from './components/CategorySelectBox';
import SortSelectBox from './components/SortSelectBox';

import Restaurants from './domain/Restaurants';
import Validator from './domain/Validator';
import {
  getFilteredRestaurantsByCategory,
  getSortedRestaurants,
  getFavoriteRestaurants,
} from './domain/utils';

import { $ } from './utils/dom';
import store from './utils/store';
import primaryKeyGenerator from './utils/primaryKeyGenerator';

import { RESTAURANTS_KEY } from './constants/storeKey';

export default class App {
  #restaurants;

  #modal;
  #restaurantList;

  constructor() {
    const restaurantsData = store.getLocalStorage(RESTAURANTS_KEY);
    this.#restaurants = new Restaurants(restaurantsData);

    this.#modal = new Modal($('#modal'));
    this.#restaurantList = new RestaurantList($('#restaurant-list-container'));

    this.#modal.render();
    new CategorySelectBox().render($('#restaurant-filter-container'));
    new SortSelectBox().render($('#restaurant-filter-container'));
    this.renderRestaurantListByFilterOptions();

    this.bindEvents();
  }

  bindEvents() {
    $('#modal').addEventListener('submit', this.onSubmitAddRestaurantForm.bind(this));
    $('#restaurant-filter-container').addEventListener(
      'change',
      this.renderRestaurantListByFilterOptions.bind(this)
    );
    $('#modal-open-button').addEventListener(
      'click',
      this.onClickRestaurantFormModalOpenButton.bind(this)
    );

    $('#restaurant-list-container').addEventListener(
      'click',
      this.onClickRestaurantList.bind(this)
    );

    $('#restaurant-favorite-tab').addEventListener('change', this.onChangeFavoriteTab.bind(this));
    $('#modal').addEventListener('click', this.onClickDetailFavoriteIcon.bind(this));
    $('#modal').addEventListener('click', this.onClickRestaurantDeleteButton.bind(this));
    $('#modal').addEventListener('click', this.onClickDetailModalCloseButton.bind(this));
  }

  onSubmitAddRestaurantForm(e) {
    e.preventDefault();

    const {
      category: { value: category },
      name: { value: name },
      distance: { value: distance },
      description: { value: description },
      link: { value: link },
    } = e.target.elements;

    try {
      Validator.validateFormData({ category, name, distance, link });
    } catch ({ message }) {
      alert(message);

      return;
    }

    const uniqueId = primaryKeyGenerator();

    const restaurant = {
      id: uniqueId,
      category,
      name,
      distance,
      description,
      link,
      isFavorite: false,
    };

    this.#restaurants.addRestaurant(restaurant);
    store.setLocalStorage(RESTAURANTS_KEY, this.#restaurants.getRestaurants());

    this.#modal.toggleModal();

    $('#tab-all').checked = true;
    $('#restaurant-filter-container').classList.remove('hide');
    this.renderRestaurantListByFilterOptions();
  }

  renderRestaurantListByFilterOptions() {
    const categoryOption = $('#category-filter').value;
    const sortOption = $('#sorting-filter').value;
    const restaurants = this.#restaurants.getRestaurants();

    const filteredRestaurants = getFilteredRestaurantsByCategory(restaurants, categoryOption);
    const sortedRestaurants = getSortedRestaurants(filteredRestaurants, sortOption);

    this.#restaurantList.render(sortedRestaurants);
  }

  onClickRestaurantFormModalOpenButton() {
    this.#modal.render().bindEvents();
    this.#modal.toggleModal();
  }

  onClickRestaurantList(e) {
    if (e.target.id === 'favorite-icon') {
      const restaurantId = e.target.closest('li').dataset.listid;

      this.#restaurants.toggleFavoriteRestaurant(Number(restaurantId));

      const updatedRestaurants = this.#restaurants.getRestaurants();
      store.setLocalStorage(RESTAURANTS_KEY, updatedRestaurants);

      this.renderRestaurantListByFavoriteTab();

      return;
    }

    const restaurantId = e.target.closest('li').dataset.listid;
    const targetRestaurant = this.#restaurants.getRestaurantById(Number(restaurantId));

    this.#modal.render(targetRestaurant);
    this.#modal.toggleModal();
  }

  onChangeFavoriteTab(e) {
    if (e.target.value === 'favorite') {
      const restaurants = this.#restaurants.getRestaurants();
      const favoriteRestaurants = getFavoriteRestaurants(restaurants);

      this.#restaurantList.render(favoriteRestaurants);
      $('#restaurant-filter-container').classList.add('hide');

      return;
    }

    this.renderRestaurantListByFilterOptions();
    $('#restaurant-filter-container').classList.remove('hide');
  }

  onClickDetailFavoriteIcon(e) {
    if (e.target.id !== 'detail-favorite-icon') return;

    const restaurantId = $('#modal-detail-view').dataset.listid;
    this.#restaurants.toggleFavoriteRestaurant(Number(restaurantId));

    const updatedRestaurants = this.#restaurants.getRestaurants();
    store.setLocalStorage(RESTAURANTS_KEY, updatedRestaurants);

    const targetRestaurant = this.#restaurants.getRestaurantById(Number(restaurantId));
    this.#modal.render(targetRestaurant);

    this.renderRestaurantListByFavoriteTab();
  }

  renderRestaurantListByFavoriteTab() {
    if ($('#tab-all').checked) {
      this.renderRestaurantListByFilterOptions();

      return;
    }

    const restaurant = this.#restaurants.getRestaurants();
    const favoriteRestaurants = getFavoriteRestaurants(restaurant);

    this.#restaurantList.render(favoriteRestaurants);
  }

  onClickRestaurantDeleteButton(e) {
    if (e.target.id !== 'restaurant-delete-button') return;

    const restaurantId = $('#modal-detail-view').dataset.listid;
    this.#restaurants.deleteRestaurant(Number(restaurantId));

    const updatedRestaurants = this.#restaurants.getRestaurants();
    store.setLocalStorage(RESTAURANTS_KEY, updatedRestaurants);

    this.renderRestaurantListByFavoriteTab();

    this.#modal.toggleModal();
  }

  onClickDetailModalCloseButton(e) {
    if (e.target.id !== 'detail-modal-close-button') return;

    this.#modal.toggleModal();
  }

  renderRestaurantListByFilterOptions() {
    const categoryOption = $('#category-filter').value;
    const sortOption = $('#sorting-filter').value;
    const restaurants = this.#restaurants.getRestaurants();

    const filteredRestaurants = getFilteredRestaurantsByCategory(restaurants, categoryOption);
    const sortedRestaurants = getSortedRestaurants(filteredRestaurants, sortOption);

    this.#restaurantList.render(sortedRestaurants);
  }

  renderRestaurantListByFavoriteTab() {
    if ($('#tab-all').checked) {
      this.renderRestaurantListByFilterOptions();

      return;
    }

    const restaurant = this.#restaurants.getRestaurants();
    const favoriteRestaurants = getFavoriteRestaurants(restaurant);

    this.#restaurantList.render(favoriteRestaurants);
  }
}

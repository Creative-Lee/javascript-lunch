import SelectBox from '../common/SelectBox';

const attributes = {
  name: 'category',
  id: 'category-filter',
  classList: ['restaurant-filter'],
};

const options = [
  { value: '전체', text: '전체' },
  { value: '한식', text: '한식' },
  { value: '중식', text: '중식' },
  { value: '일식', text: '일식' },
  { value: '아시안', text: '아시안' },
  { value: '양식', text: '양식' },
  { value: '기타', text: '기타' },
];

export default class CategorySelectBox extends SelectBox {
  constructor(targetElement: Element) {
    super(targetElement, attributes, options);
  }
}

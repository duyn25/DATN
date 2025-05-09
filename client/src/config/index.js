export const registerFormControls = [
    {
        name: 'userName',
        label: 'Tên người dùng',
        placeholder: 'Nhập tên người dùng',
        componentType:'input',
        type:'text',
    },
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Nhập email',
        componentType:'input',
        type:'email',
    },
    {
        name: 'password',
        label: 'Mật khẩu',
        placeholder: 'Nhập mật khẩu',
        componentType:'input',
        type:'password',
    },
];

export const loginFormControls = [
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Nhập email',
        componentType:'input',
        type:'email',
    },
    {
        name: 'password',
        label: 'Mật khẩu',
        placeholder: 'Nhập mật khẩu',
        componentType:'input',
        type:'password',
    },
];

export const addSpecFormElements =[
    
    {
        label: "Tên thông số",
        name: "specName",
        componentType: "input",
        type: "text",
        placeholder: "Nhập tên thông số",
        },
        {
        label: "Mô tả",
        name: "specDescription",
        componentType: "textarea",
        placeholder: "Nhập mô tả",
        },
        {
            label: "Kiểu dữ liệu",
            name: "specType",
            type: "text",
            componentType: "select",
            options: [
                { id: "number", label: "Number" },
                { id: "text", label: "Text" },
            ],
            },
            
        {
            label: "Đơn vị",
            name: "specUnit",
            type: "text",
            placeholder: "Nhập đơn vị",
        },
    
];

export const addressFormControls = [
    {
      label: "Địa chỉ",
      name: "address",
      componentType: "input",
      type: "text",
      placeholder: "Nhập địa chỉ",
    },
    {
      label: "Thành phố",
      name: "city",
      componentType: "input",
      type: "text",
      placeholder: "Nhập thành phố",
    },
    {
      label: "SĐT",
      name: "phone",
      componentType: "input",
      type: "text",
      placeholder: "",
    },
    {
      label: "Ghi chú",
      name: "notes",
      componentType: "textarea",
      placeholder: "",
    },
  ];

  export const addProductFormElements = (categoryList = [], selectedCategorySpecs = []) => {
    if (!Array.isArray(categoryList) || !Array.isArray(selectedCategorySpecs)) {
      console.error('Categories or selectedCategorySpecs is not an array');
      return []; 
    }
    console.log('Selected Category Specs:', selectedCategorySpecs);

    const baseFields = [
      {
        label: "Tên sản phẩm",
        name: "productName",
        componentType: "input",
        type: "text",
        placeholder: "Nhập tên sản phẩm",
      },
      {
        label: "Mô tả",
        name: "description",
        componentType: "textarea",
        placeholder: "Nhập mô tả",
      },
      {
        label: "Hãng sản xuất",
        name: "brand",
        componentType: "input",
        type: "text",
        placeholder: "Nhập hãng",
      },
      {
        label: "Danh mục",
        name: "categoryId",
        componentType: "select",
        options: categoryList.map((cat) => ({
          id: cat._id,
          label: cat.categoryName,
        })),
      },
      {
        label: "Giá",
        name: "price",
        componentType: "input",
        type: "number",
        placeholder: "Nhập giá",
      },
      {
        label: "Giá sau giảm",
        name: "salePrice",
        componentType: "input",
        type: "number",
        placeholder: "Nhập giá giảm (nếu có)",
      },
      {
        label: "Số lượng trong kho",
        name: "totalStock",
        componentType: "input",
        type: "number",
        placeholder: "Nhập số lượng",
      },
    ];
  
    const specFields = selectedCategorySpecs.map((spec) => ({
      label: spec.specName,
      name: `specifications.${spec._id}`,
      componentType: "input",
      type: "text",
      placeholder: `Nhập ${spec.specName}`,
    }));
  
    return [...baseFields, ...specFields];
  };
  export const filterTitles = {
  categoryId: "Danh mục",
  brand: "Thương hiệu",
 
};

  
  export const filterOptions = {
    categoryId: [
        { id: "681d39a958ab62d31f6a7ee7", label: "Đèn pin" },
        { id: "681d39c758ab62d31f6a7ef5", label: "Nồi cơm điện" },
        { id: "681d39f358ab62d31f6a7f09", label: "Nồi lẩu điện" },
        { id: "681a8bc225840b85e3b380b8", label: "Nồi chiên" },
        { id: "681a8d2e25840b85e3b380e4", label: "Đèn điện" }
        
    ],
    brand: [
      { id: "Unie", label: "Unie" },
      { id: "Sunhouse", label: "Sunhouse" },
      { id: "Kangaroo", label: "Kangaroo" },
      { id: "Goldsun", label: "Goldsun" },
      { id: "Comet", label: "Goldsun" },
    ],
    
  
    
  };

  export const sortOptions = [
    { id: "price-lowtohigh", label: "Giá: Thấp -> cao" },
    { id: "price-hightolow", label: "Giá: Cao -> thấp" },
    { id: "title-atoz", label: "Tên: A -> Z" },
    { id: "title-ztoa", label: "Tên: Z -> A" },
  ];
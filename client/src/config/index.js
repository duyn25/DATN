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

export const addSpecFormElements = [
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
      { id: "select", label: "Select" },
    ],
  },
  {
    label: "Đơn vị",
    name: "specUnit",
    type: "text",
    componentType: "input",
    placeholder: "Nhập đơn vị (nếu có)",
  },
  {
    label: "Danh sách lựa chọn",
    name: "allowedValues",
    componentType: "textarea",
    placeholder: "Nhập mỗi giá trị 1 dòng, ví dụ:\nCảm ứng\nNút nhấn\nXoay",
    condition: (formData) => formData?.specType === "select", 
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
    const specFields = selectedCategorySpecs.map((spec) => {
  if (spec.allowedValues && spec.allowedValues.length > 0) {
    return {
      label: spec.specName,
      name: `specifications.${spec._id}`,
      componentType: "select",
      options: spec.allowedValues.map((val) => ({
        id: val,
        label: `${val}${spec.specUnit ? " " + spec.specUnit : ""}`,
      })),
    };
  }

  return {
    label: spec.specName,
    name: `specifications.${spec._id}`,
    componentType: "input",
    type: spec.specType === "number" ? "number" : "text",
    placeholder: `Nhập ${spec.specName}`,
  };
});


  
    return [...baseFields, ...specFields];
  };


  export const sortOptions = [
    { id: "price-lowtohigh", label: "Giá: Thấp -> cao" },
    { id: "price-hightolow", label: "Giá: Cao -> thấp" },
    { id: "title-atoz", label: "Tên: A -> Z" },
    { id: "title-ztoa", label: "Tên: Z -> A" },
  ];
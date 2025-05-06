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
      label: "Mã pin",
      name: "pincode",
      componentType: "input",
      type: "text",
      placeholder: "Nhập mã pin",
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
  
  export const filterOptions = {
    Hãng: [
      { id: "menshirt", label: "Áo nam" },
        { id: "womenshirt", label: "Áo nữ" },
        { id: "kidsshirt", label: "Áo trẻ em" },
        { id: "menpants", label: "Quần nam" }
    ],
    brand: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
    
  };

  export const sortOptions = [
    { id: "price-lowtohigh", label: "Giá: Thấp -> cao" },
    { id: "price-hightolow", label: "Giá: Cao -> thấp" },
    { id: "title-atoz", label: "Tên: A -> Z" },
    { id: "title-ztoa", label: "Tên: Z -> A" },
  ];
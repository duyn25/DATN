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
                { id: "string", label: "String" },
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
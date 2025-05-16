import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";

function ProductForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  // Lấy value cho specs
  const getSpecValue = (fullName) => {
    const specId = fullName.split(".")[1];
    return formData.specifications?.[specId] || "";
  };

  const handleChange = (control, e) => {
    const val = e?.target?.value ?? e;

    if (control.name.startsWith("specifications.")) {
      const specId = control.name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specId]: val,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [control.name]: val,
      }));
    }
  };

  const renderControl = (control) => {
    const value = control.name.startsWith("specifications.")
      ? getSpecValue(control.name)
      : formData[control.name] || "";

    switch (control.componentType) {
      case "input":
        return (
          <Input
            type={control.type || "text"}
            placeholder={control.placeholder}
            value={value}
            onChange={(e) => handleChange(control, e)}
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={control.placeholder}
            value={value}
            onChange={(e) => handleChange(control, e)}
          />
        );
      case "select":
        return (
          <Select value={value} onValueChange={(val) => handleChange(control, val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={control.label} />
            </SelectTrigger>
            <SelectContent>
              {control.options?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            type="text"
            placeholder={control.placeholder}
            value={value}
            onChange={(e) => handleChange(control, e)}
          />
        );
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((control) => (
          <div className="grid w-full gap-1.5" key={control.name}>
            <Label className="mb-1">{control.label}</Label>
            {renderControl(control)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default ProductForm;

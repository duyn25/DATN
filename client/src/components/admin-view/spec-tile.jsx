import { Button } from "../ui/button";
import {
  TableRow,
  TableCell,
} from "@/components/ui/table";

function AdminSpecTile({
  specification,
  setFormData,
  setOpenForm,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <TableRow>
      <TableCell>{specification?.specName}</TableCell>
      <TableCell>{specification?.specDescription}</TableCell>
      <TableCell>{specification?.specType}</TableCell>
      <TableCell>{specification?.specUnit}</TableCell>
      <TableCell className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setOpenForm(true);
            setCurrentEditedId(specification._id);
            setFormData(specification);
          }}
        >
          Sửa
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleDelete(specification._id)}
        >
          Xoá
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default AdminSpecTile;

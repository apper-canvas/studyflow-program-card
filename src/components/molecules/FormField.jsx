import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Textarea from "@/components/atoms/Textarea"
import { cn } from "@/utils/cn"

const FormField = ({
  label,
  type = "input",
  error,
  children,
  className,
  ...props
}) => {
  const renderField = () => {
    switch (type) {
      case "select":
        return <Select error={error} {...props}>{children}</Select>
      case "textarea":
        return <Textarea error={error} {...props} />
      default:
        return <Input error={error} {...props} />
    }
  }

  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label>{label}</Label>}
      {renderField()}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}

export default FormField
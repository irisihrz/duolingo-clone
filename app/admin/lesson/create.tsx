import {
  Create,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const LessonCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="title" validate={[required()]} label="Titre" />
        <ReferenceInput source="unitId" reference="units" />
        <NumberInput source="order" validate={required()} label="Ordre" />
      </SimpleForm>
    </Create>
  );
};

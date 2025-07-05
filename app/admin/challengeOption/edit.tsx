import {
  Edit,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const ChallengeOptionEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <NumberInput source="id" validate={[required()]} label="Id" />
        <TextInput source="text" validate={[required()]} label="Texte" />
        <TextInput source="correct" validate={[required()]} label="Correct" />
        <ReferenceInput source="challengeId" reference="challenges" />
        <TextInput source="imageSrc" label="URL de l'image" />
      </SimpleForm>
    </Edit>
  );
};

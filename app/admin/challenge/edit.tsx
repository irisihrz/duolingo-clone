import {
  Edit,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const ChallengeEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <NumberInput source="id" validate={[required()]} label="Id" />
        <TextInput source="question" validate={[required()]} label="Question" />
        <TextInput
          source="challengeType"
          validate={[required()]}
          label="Type de défi"
        />
        <SelectInput
          source="challengeType"
          choices={[
            {
              id: "SELECT",
              name: "Sélection",
            },
            {
              id: "ASSIST",
              name: "Assistance",
            },
          ]}
        />
        <ReferenceInput source="lessonId" reference="lessons" />
        <NumberInput source="order" validate={required()} label="Ordre" />
      </SimpleForm>
    </Edit>
  );
};

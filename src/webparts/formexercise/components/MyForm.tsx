import * as React from 'react';
import { TextField, PrimaryButton } from 'office-ui-fabric-react';
import styles from './Formexercise.module.scss';

interface IFormProps {
  onSubmit: (title: string, description: string) => void;
}

interface IFormState {
  title: string;
  description: string;
}

export default class MyForm extends React.Component<IFormProps, IFormState> {
  constructor(props: IFormProps) {
    super(props);

    this.state = {
      title: '',
      description: '',
    };
  }

  private handleTitleChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    this.setState({ title: newValue || '' });
  };

  private handleDescriptionChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    this.setState({ description: newValue || '' });
  };

  private handleSubmit = () => {
    const { title, description } = this.state;
    this.props.onSubmit(title, description);
  };

  render() {
    return (
      <div>
        <h1 className={`${styles.welcome}`}>Sharepoint List Form</h1>
        <TextField label="Title" value={this.state.title} onChange={this.handleTitleChange} className={styles.textField} />
        <TextField label="Description" multiline rows={3} value={this.state.description} onChange={this.handleDescriptionChange} className={styles.textField} />
        <PrimaryButton text="Submit" onClick={this.handleSubmit} className={styles.submitButton} />
      </div>
    );
  }
}

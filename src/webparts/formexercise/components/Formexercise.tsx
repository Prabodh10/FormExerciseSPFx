import * as React from 'react';
import styles from './Formexercise.module.scss';
// import { IFormexerciseProps } from './IFormexerciseProps';
// import { WebPartContext } from '@microsoft/sp-webpart-base';
import MyForm from './MyForm';

import { SPHttpClient } from '@microsoft/sp-http';


// IFormexerciseProps.ts
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IFormexerciseProps {
  // Include other props if any
  context: WebPartContext;
}

interface IFormexerciseState {
  title: string;
  description: string;
}


export default class Formexercise extends React.Component<IFormexerciseProps, IFormexerciseState, {}> {
  constructor(props: IFormexerciseProps) {
    super(props);//removed ; here

    this.state = {
      title: '',
      description: '',
    };
  }


  // private async getFormDigest(): Promise<string> {
  //   const response = await this.props.context.spHttpClient.post(
  //     `${this.props.context.pageContext.web.absoluteUrl}/_api/contextinfo`,
  //     SPHttpClient.configurations.v1,
  //     {
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //     }
  //   );
  
  //   const data = await response.json();
  //   return data.d.GetContextWebInformation.FormDigestValue;
  // }


  private async getFormDigest(): Promise<string> {
    try {
      const response = await this.props.context.spHttpClient.post(
        `${this.props.context.pageContext.web.absoluteUrl}/_api/contextinfo`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
  
      const data = await response.json();
  
      // Log the entire response data
      console.log('Context Info Response:', data);
  
      // Ensure that the expected property path exists
      if (data && data.FormDigestValue) {
        //return data.d.GetContextWebInformation.FormDigestValue;
        return data.FormDigestValue;
      } else {
        console.error('Unexpected response structure:', data);
        throw new Error('Unable to obtain form digest.');
      }
    } catch (error) {
      console.error('Error getting form digest:', error);
      throw error;
    }
  }
  
  
  
  private handleSubmit = async (title: string, description: string) => {

    if (!title || !description) {
      window.alert('Title and Description cannot be blank.');
      return;
    }

    const { context } = this.props;
    const siteUrl = context.pageContext.web.absoluteUrl;

    const listTitle = 'EmployeeDetails';
    const endpointUrl = `${siteUrl}/_api/web/lists/getbytitle('${listTitle}')/items`;
//new code

const formDigest = await this.getFormDigest();


//new code




    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.append('Content-type', 'application/json;odata=verbose');
    requestHeaders.append('Accept', 'application/json;odata=verbose');
    // requestHeaders.append('X-RequestDigest', formDigest);
    requestHeaders.append('X-RequestDigest', formDigest);
    requestHeaders.append('X-HTTP-Method', 'POST');

    const requestData = {
      __metadata: { type: 'SP.Data.EmployeeDetailsListItem' },
      Title: title,
      Description: description,
    };

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestData),
    };

    try {
      const response = await fetch(endpointUrl, requestOptions);

      if (response.ok) {

        window.alert('Item added successfully');

        this.setState({
          title: '',
          description: '',
        },
        () => {
          console.log('Form fields reset:', this.state);
        } 
        );

        console.log('Form fields reset:', this.state.title, this.state.description);
        window.location.reload();
      

        // console.log('Item added successfully');

        // this.setState({
        //   title: '',  // assuming 'title' and 'description' are the state properties
        //   description: '',
        // });

      } else {
        console.error('Error adding item:', response.statusText);


        
      }
    } catch (error) {
      console.error('Error adding item:', error);

        // Log additional details if available
      if (error instanceof Response) {
        console.error('Response status:', error.status);
        console.error('Response status text:', error.statusText);
        const responseText = await error.text();
        console.error('Response body:', responseText);
  }

    }
  };

  public render(): React.ReactElement<IFormexerciseProps> {
    console.log('Component rendering...');
    return (
      <section className={`${styles.formexercise}`}>
        <div>
          <MyForm onSubmit={this.handleSubmit} />
        </div>
      </section>
    );
  }
}

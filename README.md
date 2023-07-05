# Incidents Management

Welcome to the Incidents Management reference sample app for CAP.

### Domain

The application allows customers to create incidents, processed by support team members. 
Both add comments to a conversation.
![domain drawio](https://github.com/SAP-samples/cap-sample-incidents-mgmt/assets/12186013/a1de9cf1-1346-427d-b5a2-55a14428e8f5)


### Setup

```sh
git clone https://github.com/SAP-samples/incidents-mgmt.git
cd incidents-mgmt
```
```sh
npm i
```

### Run

```sh
cds w
```

### Testing

```sh
npm t
```

### UI Preview
The initial app state does not include dedicated Fiori UIs. However, there is a preview functionality that allows to see dynamically generated UIs.

- Start the application with `cds w`
- Open the server URL : `http://localhost:4004` on the browser
- Click on Fiori Preview e.g. next to Service Endpoint `/incidents` on Entity `Incidents`
- On the authentication popup enter `alice` with no password (if you get a forbidden error and the popup doesn't show try incognito mode or clearing browsing data)


## How to obtain support
[Create an issue](https://github.com/SAP-samples/incidents-mgmt/issues) in this repository if you find a bug or have questions about the content.
 
For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## Contributing
If you wish to contribute code, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## License
Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.

# Work Management System Frontend
This is a React application designed to create a dynamic and flexible work management system for the SLAC National Accelerator Laboratory. The project is built using JSX and plain CSS (with some CSS modules) to ensure simplicity and flexibility in styling. We use React Router for managing routes, and the project is bundled using Create React App.

# Getting Started
To get the development environment up and running, first install all dependencies:

```bash
# Install dependencies
$ npm install

# Runs the app in the development mode.
$ npm start # open http://localhost:3000 to view in browser. Page will reload when you make changes, any lint errors will be in console.
```

This app can be built for production using the following command:
```bash
# The output will be generated in the build/ directory, which can then be deployed on any static server (e.g., Netlify, GitHub Pages, etc.).
$ npm run build
```

# Project Structure
The project follows a straightforward React structure. We make use of JSX for component definitions, keeping the architecture intuitive and easy to navigate.
- Components: Custom-built components are favored to ensure flexibility and minimize bloat.
- CSS & CSS Modules: Plain CSS is used to keep styling clear and modular, while CSS modules allow for scoped styles where necessary.
- Routing: Routing is handled by React Router, ensuring a dynamic yet structured navigation experience.

# Styling
We employ CSS and CSS Modules for styling. This allows us to:
- Scope styles to specific components, preventing style leaks.
- Use plain CSS for global and reusable styles.

# State Management
State management is kept minimal to avoid unnecessary complexity at this stage:
- Local Component State: Most state is managed locally within components, making it easy to keep track of UI-specific interactions.
Future considerations for state management may include introducing libraries like Zustand as the application grows in complexity.

# Routing
Routing is managed with React Router. The application is structured around key pages, and additional routes may be added as the work management system evolves.

Key Routes:
- /home – Home Page (main dashboard)
- /cwm/dashboard – Personal Dashboard Page (work management interface)
- /cwm/:id – View details for specific work tickets

# Error Handling
The app distinguishes between critical and non-critical errors:
- Critical Errors: These cause the page to crash, triggering an error page.
- Non-Critical Errors: These are recoverable and are handled gracefully, typically using UI notifications or toasts to inform the user.

# Resources & References

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
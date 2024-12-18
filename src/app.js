import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login'; // ตรวจสอบเส้นทางการนำเข้า
import Register from './components/Register'; // ตรวจสอบเส้นทางการนำเข้า

const App = () => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    {/* เส้นทางอื่น ๆ */}
                </Switch>
            </div>
        </Router>
    );
};

export default App;

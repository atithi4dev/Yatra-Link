import fetch from 'node-fetch';

async function authenticatePassenger(req, res, next) {
    try {
        const { username, password } = req.body;

        const authResp = await fetch('http://auth-service:5001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'passenger', username, password }),
        });

        if (!authResp.ok) {
            return res.status(401).json({ status: 'error', message: 'Auth failed' });
        }

        const authData = await authResp.json();
        req.auth = authData; // attach JWT / userId info
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Auth service error' });
    }
}

// --- Routes ---

async function registerPassenger(req, res) {
    try {
        const resp = await fetch('http://auth-service:5001/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body), // contains email, password, basic info
        });
        const data = await resp.json();
        res.status(resp.status).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Auth service error' });
    }
};

async function loginPassenger(req, res) {
    try {
        const { username } = req.body;

        const passengerResp = await fetch('http://passenger-service:5008/validate-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.auth.token}`, // pass JWT
            },
            body: JSON.stringify({ username }),
        });

        const data = await passengerResp.json();
        res.json({ status: 'ok', message: 'User validated', passengerData: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Passenger service error' });
    }
};

async function sendOTP(req, res) {
    const resp = await fetch('http://passenger-service:5008/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
};

async function verifyOTP(req, res) {
    const resp = await fetch('http://passenger-service:5008/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
};

async function nearbyBusses(req, res) {
    const resp = await fetch('http://passenger-service:5008/nearby-buses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
};

async function upcomingBusses(req, res) {
    const resp = await fetch('http://passenger-service:5008/upcoming-buses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
};

async function getBudByBusId(req, res) {
    const resp = await fetch(`http://passenger-service:5008/bus/${req.params.busId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
};



export {
    sendOTP,
    loginPassenger,
    registerPassenger,
    authenticatePassenger,
    verifyOTP, 
    nearbyBusses,
    upcomingBusses,
    getBudByBusId
}
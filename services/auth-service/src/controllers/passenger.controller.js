async function loginPassenger (req, res) {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email });
    if (!client || !(await client.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: client._id,
      userName: client.userName,
      email: client.email,
      phone: client.phone,
      role: client.role,
      token: generateToken(client._id, client.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function registerPassenger (req, res) {
  try {
    const { userName, phone, email, password } = req.body;

    if (!userName || !phone || !email || !password) {
      return res.status(400).json({ message: "Name, email, phone and password are required" });
    }

    const clientExists = await Client.findOne({ email });
    if (clientExists) {
      return res.status(400).json({ message: "Client already exists" });
    }

    const client = await Client.create({ userName, email, password, phone });

    res.status(201).json({
      _id: client._id,
      userName: client.userName,
      email: client.email,
      phone: client.phone,
      role: client.role,
      token: generateToken(client._id, client.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export {
    registerPassenger,
    loginPassenger
 }
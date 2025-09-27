[Frontend] 
    |
    | POST /signup or /login
    v
[API Gateway]
    |
    | routes to
    v
[Auth Service] -----------------+
    |                           |
    | validates credentials      | publishes USER_SIGNED_UP event
    | creates auth record        |
    v                           |
[Auth MongoDB]                  |
(email, passwordHash, role)     |
                                |
                                v
                       [Passenger Service]
                                |
                                | creates full profile
                                v
                       [Passenger MongoDB]
                 (name, bookings, preferences)

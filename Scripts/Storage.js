export const ttl = 86400 * 30;

export const set = (keyName, keyValue, ttl) => {
    const data = {
        value: keyValue,                  // store the value within this object
        ttl: Date.now() + (ttl * 1000),   // store the TTL (time to live)
    }

    // store data in LocalStorage
    localStorage.setItem(keyName, JSON.stringify(data));
};

export const get = (keyName) => {
    const data = localStorage.getItem(keyName);
    if (!data) {     // if no value exists associated with the key, return null
        return null;
    }

    const item = JSON.parse(data);

    // If TTL has expired, remove the item from localStorage and return null
    if (Date.now() > item.ttl) {
        localStorage.removeItem(key);
        return null;
    }

    // return data if not expired
    return item.value;
};

// Returns seconds left in TTL.
export const getTTL = (keyName) => {
    const data = localStorage.getItem(keyName);
    if (!data) {     // if no value exists associated with the key, return null
        return null;
    }

    const item = JSON.parse(data);
    const date = Date.now();

    // If TTL has expired, remove the item from localStorage and return null
    if (date > item.ttl) {
        localStorage.removeItem(key);
        return null;
    }

    // return data if not expired
    return (item.ttl - date);
};

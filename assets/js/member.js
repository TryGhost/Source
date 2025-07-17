const getMemberByEmail = async (email, contentApiKey) => {
    if (!email) {
        return null;
    }

    const url = `/ghost/api/content/members/${encodeURIComponent(email)}?key=${contentApiKey}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });

    if (!res.ok) {
        // メール未登録などで404の場合はnull扱いにする
        return null;
    }

    const data = await res.json();

    const member = data.members[0];

    return member || null;
};

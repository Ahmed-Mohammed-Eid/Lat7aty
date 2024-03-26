export function extractTokenFromCookie(cookieString) {
    const tokenName = 'token='; // Replace with the name of your token cookie
    const cookieParts = cookieString.split(';');
    const tokenPart = cookieParts.find(part => part.trim().startsWith(tokenName));
    if (!tokenPart) {
        return null;
    }
    return tokenPart.trim().substring(tokenName.length);
}
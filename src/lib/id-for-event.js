import crypto from 'crypto';
/**
 * @param {{ start: string, end: string, description: string, discipline: { name: string } }} event
 */
export function idForEvent(event) {
	let hash = crypto.createHash('sha1');
	hash.update(`${event.start}-${event.end}-${event.description}-${event.discipline.name}`);
	return hash.digest('hex').slice(0, 8); // Shorten the hash to 8 characters
};

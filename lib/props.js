const AttrSerializer = require('./attrSerizalizer');
const config = require('./config');

class Props {
	constructor(components) {
		this.serializer = new AttrSerializer(components);
	}

	serialize(props) {
		return this.serializer.serialize(props);
	}

	getFromElement(el) {
		const attr = el.getAttribute(config.attrs.props);
		return this.serializer.deserialize(attr);
	}
}

module.exports = Props;

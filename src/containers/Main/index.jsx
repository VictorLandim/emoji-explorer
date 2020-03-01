import React, { useState } from 'react';
import Twemoji from 'react-twemoji';
import twemoji from 'twemoji';
import './styles.scss';

function toUTF16(codePoint) {
    var TEN_BITS = parseInt('1111111111', 2);
    function u(codeUnit) {
        return '\\u' + codeUnit.toString(16).toUpperCase();
    }

    if (codePoint <= 0xffff) {
        return u(codePoint);
    }
    codePoint -= 0x10000;

    // Shift right to get to most significant 10 bits
    var leadSurrogate = 0xd800 + (codePoint >> 10);

    // Mask to get least significant 10 bits
    var tailSurrogate = 0xdc00 + (codePoint & TEN_BITS);

    return u(leadSurrogate) + u(tailSurrogate);
}

const renderContent = (loading, results) =>
    loading ? (
        <div className="loader">Loading...</div>
    ) : (
        <Twemoji className="content">
            {results
                .filter(e => !!e.moji)
                .map(e => (
                    <div key={e.moji} className="emoji">
                        {/* {toUTF16(e.moji.codePointAt(0))} */}
                        {e.moji}
                    </div>
                ))}
        </Twemoji>
    );

const onSubmit = async (e, search, setLoading, setResults) => {
    e.preventDefault();

    setLoading(true);

    const stream = await fetch(`https://www.emojidex.com/api/v1/search/emoji?code_cont=${search}`);
    const results = await stream.json();

    setResults(results.emoji);
    setLoading(false);
};

export default () => {
    const [results, setResults] = useState([]);
    const [search, setSearch] = useState(null);
    const [loading, setLoading] = useState(false);

    console.log(twemoji.parse(toUTF16('📻')));

    return (
        <section className="main">
            <form onSubmit={e => onSubmit(e, search, setLoading, setResults)}>
                <input type="text" className="input" onChange={e => setSearch(e.target.value)} />
            </form>
            <div>{renderContent(loading, results)}</div>
        </section>
    );
};

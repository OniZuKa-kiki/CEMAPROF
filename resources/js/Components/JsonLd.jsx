export default function JsonLd({ data, id = 'data' }) {
    if (!data) {
        return null;
    }

    return (
        <script
            type="application/ld+json"
            head-key={`jsonld-${id}`}
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

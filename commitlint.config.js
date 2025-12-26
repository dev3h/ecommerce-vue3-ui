export default {
    rules: {
        'header-match-pattern': [2, 'always', '^ECOM \\d+: .+$'],
    },
    plugins: [
        {
            rules: {
                'header-match-pattern': ({ header }, when, pattern) => {
                    const regex = new RegExp(pattern)
                    const isValid = regex.test(header)
                    return [
                        isValid,
                        isValid
                            ? undefined
                            : 'Commit message phải theo format: ECOM <Redmine ID>: <message>',
                    ]
                },
            },
        },
    ],
}

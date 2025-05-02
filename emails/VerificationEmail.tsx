import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
    Container,
    Img,
    Column,
    Hr,
} from '@react-email/components';
import { TailwindConfig, Tailwind } from '@react-email/tailwind';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Verification Code</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Helvetica"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Helvetica"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={700}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Here's your verification code: {otp}</Preview>
            <Tailwind>
                <div className="bg-black font-sans py-10">
                    <Container className="bg-zinc-950 max-w-xl mx-auto rounded-lg shadow-lg p-8">
                        {/* Logo/Header */}
                        <Section>
                            <Row>
                                <Column>
                                    <Text className="text-2xl font-bold text-center text-lime-400 mb-8">
                                        TrueFeedback
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        {/* Content */}
                        <Section>
                            <Heading className="text-2xl font-semibold text-white text-center mb-6">
                                Account Verification
                            </Heading>

                            <Text className="text-gray-200 mb-4">
                                Hello {username},
                            </Text>

                            <Text className="text-gray-200 mb-6">
                                Thank you for registering with us. Please use the following verification
                                code to complete your registration:
                            </Text>

                            <div className="bg-zinc-900 mx-auto w-48 rounded-md p-4 text-center mb-6">
                                <Text className="text-3xl tracking-widest font-bold text-lime-400">
                                    {otp}
                                </Text>
                            </div>

                            <Text className="text-gray-200 mb-4">
                                This code will expire in 30 minutes. If you did not request this code, please ignore this email.
                            </Text>

                            <Hr className="border-zinc-800 my-8" />

                            <Text className="text-gray-400 text-sm mb-6">
                                If you're having trouble with the code, you can also verify your account by clicking the button below:
                            </Text>

                            <Section className="text-center mb-8">
                                <Button
                                    href={`http://localhost:3000/verify/${username}`}
                                    className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-3 px-6 rounded-md no-underline inline-block"
                                >
                                    Verify Account
                                </Button>
                            </Section>

                            <Text className="text-gray-400 text-xs text-center mt-8">
                                © 2023 TrueFeedback. All rights reserved.<br />
                                This email was sent to you because you signed up for TrueFeedback.
                            </Text>
                        </Section>
                    </Container>
                </div>
            </Tailwind>
        </Html>
    );
}
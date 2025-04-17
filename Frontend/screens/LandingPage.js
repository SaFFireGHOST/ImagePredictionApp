import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar
} from 'react-native';
import {
    ShieldIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    ClockIcon,
    BarChartIcon,
    UsersIcon
} from 'lucide-react-native';

// Custom Button Component
const Button = ({
    children,
    variant = 'primary',
    size = 'lg',
    style,
    textStyle,
    onPress
}) => {
    const baseStyles = {
        primary: {
            backgroundColor: '#2563EB', // primary blue
            borderColor: '#2563EB',
        },
        secondary: {
            backgroundColor: 'white',
            borderColor: '#2563EB',
        },
        outline: {
            backgroundColor: 'transparent',
            borderColor: 'white',
            borderWidth: 1,
        },
        tertiary: {
            backgroundColor: 'transparent',
            borderColor: 'grey',
            borderWidth: 1,
        }

    };

    const sizeStyles = {
        lg: {
            paddingVertical: 12,
            paddingHorizontal: 24,
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                {
                    ...baseStyles[variant],
                    ...sizeStyles[size],
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                style
            ]}
        >
            <Text
                style={[
                    {
                        color: variant === 'primary' ? 'white' :
                            variant === 'secondary' ? '#2563EB' :
                                variant==='tertiary'?'black':'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    },
                    textStyle
                ]}
            >
                {children}
            </Text>
        </TouchableOpacity>
    );
};

// Card Component
const Card = ({ icon: Icon, title, description }) => (
    <View
        style={{
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
        }}
    >
        {Icon && <Icon size={40} color="#2563EB" style={{ marginBottom: 8 }} />}
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
            {title}
        </Text>
        <Text style={{ color: '#6B7280' }}>
            {description}
        </Text>
    </View>
);

const LandingPage = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar barStyle="dark-content" />
            <ScrollView>
                {/* Header */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E5E7EB'
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../assets/logo2.png')} style={{ width: 24, height: 24 }} />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>
                            SMITA
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                        <Text style={{ color: '#6B7280' }}>Features</Text>
                        <Text style={{ color: '#6B7280' }}>How It Works</Text>
                    </View>
                </View>

                {/* Hero Section */}
                <View
                    style={{
                        padding: 16,
                        backgroundColor: '#F9FAFB',
                        paddingVertical: 32
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontSize: 32,
                                fontWeight: 'bold',
                                marginBottom: 16
                            }}
                        >
                            Early Detection Saves Lives
                        </Text>
                        <Text
                            style={{
                                fontSize: 18,
                                color: '#6B7280',
                                marginBottom: 16
                            }}
                        >
                            SMITA uses advanced machine learning to help detect oral cancer in its early stages, when treatment is most effective.
                        </Text>

                        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
                            <Button variant="primary" onPress={()=>navigation.navigate('Login')}>
                                Get Started
                                <ArrowRightIcon size={16} color="white" style={{ marginLeft: 8 }} />
                            </Button>
                            <Button variant="tertiary">
                                Learn More
                            </Button>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 16 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckCircleIcon size={16} color="#2563EB" style={{ marginRight: 4 }} />
                                <Text>HIPAA Compliant</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckCircleIcon size={16} color="#2563EB" style={{ marginRight: 4 }} />
                                <Text>Clinically Validated</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckCircleIcon size={16} color="#2563EB" style={{ marginRight: 4 }} />
                                <Text>Secure Data</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ alignItems: 'center', marginTop: 32 }}>
                        <Image
                            source={require('../assets/example.png')}
                            style={{
                                width: 280,
                                height: 560,
                                borderRadius: 20,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                                backgroundColor:'transparent',
                            }}
                        />
                    </View>
                </View>

                {/* Features Section */}
                <View style={{ padding: 16, paddingVertical: 32 }}>
                    <View style={{ alignItems: 'center', marginBottom: 32 }}>
                        <Text
                            style={{
                                backgroundColor: '#2563EB10',
                                color: '#2563EB',
                                paddingHorizontal: 12,
                                paddingVertical: 4,
                                borderRadius: 16,
                                marginBottom: 8
                            }}
                        >
                            Features
                        </Text>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
                            Advanced Technology for Early Detection
                        </Text>
                        <Text
                            style={{
                                color: '#6B7280',
                                textAlign: 'center',
                                marginTop: 8
                            }}
                        >
                            Our AI-powered platform provides healthcare professionals with powerful tools to identify potential oral cancer indicators with greater accuracy.
                        </Text>
                    </View>

                    <View>
                        <Card
                            icon={BarChartIcon}
                            title="AI-Powered Analysis"
                            description="Advanced machine learning algorithms analyze images to detect potential abnormalities."
                        />
                        <Card
                            icon={ClockIcon}
                            title="Rapid Results"
                            description="Get preliminary analysis in minutes, not days or weeks."
                        />
                        <Card
                            icon={ShieldIcon}
                            title="Secure & Private"
                            description="HIPAA-compliant platform with end-to-end encryption for all patient data."
                        />
                        <Card
                            icon={UsersIcon}
                            title="Patient Management"
                            description="Track patient history and monitor changes over time."
                        />
                    </View>
                </View>

                {/* How It Works Section */}
                <View
                    style={{
                        backgroundColor: '#F9FAFB',
                        padding: 16,
                        paddingVertical: 32
                    }}
                >
                    <View style={{ alignItems: 'center', marginBottom: 32 }}>
                        <Text
                            style={{
                                backgroundColor: '#2563EB10',
                                color: '#2563EB',
                                paddingHorizontal: 12,
                                paddingVertical: 4,
                                borderRadius: 16,
                                marginBottom: 8
                            }}
                        >
                            How It Works
                        </Text>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
                            Simple Process, Powerful Results
                        </Text>
                    </View>

                    <View>
                        {[
                            {
                                number: '1',
                                title: 'Capture Images',
                                description: 'Take high-quality images of the patient\'s oral cavity using your smartphone or tablet.'
                            },
                            {
                                number: '2',
                                title: 'AI Analysis',
                                description: 'Our AI algorithms analyze the images to identify potential areas of concern.'
                            },
                            {
                                number: '3',
                                title: 'Review Results',
                                description: 'Receive detailed reports with highlighted areas of concern and recommended next steps.'
                            }
                        ].map((step) => (
                            <View
                                key={step.number}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                    borderRadius: 8,
                                    padding: 16,
                                    marginBottom: 16,
                                    alignItems: 'center'
                                }}
                            >
                                <View
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 24,
                                        backgroundColor: '#2563EB',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: 8
                                    }}
                                >
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                        {step.number}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                                    {step.title}
                                </Text>
                                <Text style={{ color: '#6B7280', textAlign: 'center' }}>
                                    {step.description}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* CTA Section */}
                <View
                    style={{
                        backgroundColor: '#2563EB',
                        padding: 16,
                        paddingVertical: 32,
                        alignItems: 'center'
                    }}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 24,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: 16
                        }}
                    > 
                        Join the Fight Against Oral Cancer
                    </Text>
                    <Text
                        style={{
                            color: 'white',
                            textAlign: 'center',
                            marginBottom: 16
                        }}
                    >
                        Early detection is key to successful treatment. Start using SMITA in your practice today.
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                        <Button variant="secondary" onPress={()=>navigation.navigate('Signup')}>Sign Up Now</Button>
                        <Button variant="outline">Request a Demo</Button>
                    </View>
                </View>

                {/* Footer */}
                <View
                    style={{
                        backgroundColor: '#111827',
                        padding: 16,
                        paddingVertical: 32
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Image source={require('../assets/logo2.png')} style={{ width: 24, height: 24 }} />
                                <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 8 }}>
                                    SMITA
                                </Text>
                            </View>
                            <Text style={{ color: '#9CA3AF' }}>
                                Advanced oral cancer detection powered by artificial intelligence.
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            borderTopWidth: 1,
                            borderTopColor: '#374151',
                            marginTop: 32,
                            paddingTop: 16,
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{ color: '#9CA3AF' }}>
                            © {new Date().getFullYear()} SMITA. All rights reserved.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default LandingPage;
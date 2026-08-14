import React from 'react'
import { Truck, Shield, Headphones } from 'lucide-react'

const Features = () => {
    return (
        <section className="py-12 bg-muted/50">
            <div className="w-full max-w-6xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Free Shipping */}
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-pink-100 rounded-full flex items-center justify-center">
                            <Truck className="h-6 w-6 text-pink-600" />
                        </div>

                        <div>
                            <h3 className="font-semibold">Free Shipping</h3>
                            <p className="text-muted-foreground">
                                On orders over $50
                            </p>
                        </div>
                    </div>


                    {/* Secure Payment */}
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-pink-100 rounded-full flex items-center justify-center">
                            <Shield className="h-6 w-6 text-pink-600" />
                        </div>

                        <div>
                            <h3 className="font-semibold">Secure Payment</h3>
                            <p className="text-muted-foreground">
                                100% secure transactions
                            </p>
                        </div>
                    </div>


                    {/* 24/7 Support */}
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-pink-100 rounded-full flex items-center justify-center">
                            <Headphones className="h-6 w-6 text-pink-600" />
                        </div>

                        <div>
                            <h3 className="font-semibold">24/7 Support</h3>
                            <p className="text-muted-foreground">
                                Always here to help
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    )
}

export default Features
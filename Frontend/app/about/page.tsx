import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Lightbulb, Heart, Users, TrendingUp, Shield, Sparkles } from "lucide-react"

const impactStats = [
  { label: "Women Empowered", value: "500+", icon: Users },
  { label: "Local Businesses", value: "300+", icon: TrendingUp },
  { label: "Happy Customers", value: "10,000+", icon: Heart },
  { label: "Communities Served", value: "50+", icon: Shield },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-peach/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-lavender/30 blur-3xl" />
          
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                About Us
              </span>
              <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
                Empowering Women,
                <br />
                <span className="text-primary">One Business at a Time</span>
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                UDYOGINI is more than a platform — it is a movement to empower women entrepreneurs, 
                celebrate their talents, and connect them with communities who value local, 
                home-based businesses.
              </p>
            </div>
          </div>
        </section>

        {/* Image Section */}
        <section className="bg-background py-12">
          <div className="container mx-auto px-4">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border/50 shadow-xl">
              <Image
                src="/images/about-image.jpg"
                alt="Women entrepreneurs working together"
                width={1200}
                height={600}
                className="w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* About Sections */}
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2">
              {/* About UDYOGINI */}
              <Card className="border-border/50 bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-peach/50">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">
                    About UDYOGINI
                  </h2>
                  <p className="leading-relaxed text-muted-foreground">
                    UDYOGINI was born from a simple yet powerful idea: to provide a dedicated space 
                    where talented women entrepreneurs can showcase their skills and connect with 
                    customers in their local communities. We believe that every woman has the 
                    potential to build a successful business, and our platform is designed to 
                    make that journey easier and more accessible.
                  </p>
                </CardContent>
              </Card>

              {/* Vision & Mission */}
              <Card className="border-border/50 bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lavender/50">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">
                    Vision & Mission
                  </h2>
                  <p className="mb-4 leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Our Vision:</strong> To create a thriving 
                    ecosystem where women-owned businesses flourish and contribute to stronger, 
                    more connected communities.
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Our Mission:</strong> To empower women 
                    entrepreneurs by providing them with the tools, visibility, and support they 
                    need to grow their businesses while making it easy for customers to discover 
                    and support local talent.
                  </p>
                </CardContent>
              </Card>

              {/* How It Works */}
              <Card className="border-border/50 bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blush/50">
                    <Lightbulb className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">
                    How the Platform Works
                  </h2>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">1</span>
                      <span><strong className="text-foreground">Register:</strong> Women business owners create their profile with service details, pricing, and location.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">2</span>
                      <span><strong className="text-foreground">Discover:</strong> Customers search for services by type and location to find nearby businesses.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">3</span>
                      <span><strong className="text-foreground">Connect:</strong> Direct communication via call or WhatsApp enables easy booking and inquiries.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">4</span>
                      <span><strong className="text-foreground">Review:</strong> Customers share their experiences, building trust and credibility for businesses.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Impact & Benefits */}
              <Card className="border-border/50 bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-peach/50">
                    <Eye className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">
                    Impact & Benefits
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      <strong className="text-foreground">For Women Entrepreneurs:</strong> Free platform 
                      to showcase services, reach more customers, build reputation through reviews, 
                      and grow their business without technical barriers.
                    </p>
                    <p>
                      <strong className="text-foreground">For Customers:</strong> Easy access to verified 
                      local services, transparent pricing and ratings, support local women-owned 
                      businesses, and build meaningful community connections.
                    </p>
                    <p>
                      <strong className="text-foreground">For Communities:</strong> Stronger local economies, 
                      increased women participation in workforce, skill development, and financial 
                      independence for families.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="bg-gradient-to-r from-muted via-blush/20 to-muted py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-serif text-3xl font-bold text-foreground">
                Our Impact
              </h2>
              <p className="text-muted-foreground">
                Together, we are building a community of empowered women and satisfied customers
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {impactStats.map((stat) => (
                <Card key={stat.label} className="border-border/50 bg-card text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <stat.icon className="h-7 w-7 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

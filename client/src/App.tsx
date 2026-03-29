import { Route, Switch, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Areas from "./components/Areas";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const About = lazy(() => import("./components/About"));
const Admin = lazy(() => import("./components/Admin"));
const PostPage = lazy(() => import("./components/PostPage"));
const CategoryPage = lazy(() => import("./components/CategoryPage"));
const Servicios = lazy(() => import("./components/Servicios"));
const NoticiasPage = lazy(() => import("./components/NoticiasPage"));

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location]);
  return null;
}

function Home() {
  return (
    <>
      <Hero />
      <Areas />
      <Blog />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path="/admin">
          <Admin />
        </Route>
        <Route>
          <ScrollToTop />
          <Navbar />
          <main>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/sobre-mi" component={About} />
            <Route path="/servicios/abogado-derecho-familia-manizales" component={Servicios} />
            <Route path="/noticias" component={NoticiasPage} />
            <Route path="/noticias/:catSlug/:slug" component={PostPage} />
            <Route path="/noticias/:catSlug" component={CategoryPage} />
          </Switch>
          </main>
          <Footer />
        </Route>
      </Switch>
    </Suspense>
  );
}

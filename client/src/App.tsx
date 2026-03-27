import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Areas from "./components/Areas";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import About from "./components/About";
import Admin from "./components/Admin";
import PostPage from "./components/PostPage";
import CategoryPage from "./components/CategoryPage";

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
    <Switch>
      <Route path="/admin">
        <Admin />
      </Route>
      <Route>
        <ScrollToTop />
        <Navbar />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/sobre-mi" component={About} />
          <Route path="/noticias/:catSlug/:slug" component={PostPage} />
          <Route path="/noticias/:catSlug" component={CategoryPage} />
        </Switch>
        <Footer />
      </Route>
    </Switch>
  );
}

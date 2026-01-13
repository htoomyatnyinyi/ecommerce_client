import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function NavigationBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-2">
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent font-black italic uppercase tracking-widest text-[10px] hover:text-primary transition-colors"
            )}
          >
            <Link to="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent font-black italic uppercase tracking-widest text-[10px] hover:text-primary transition-colors">
            Collections
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-4 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background/95 backdrop-blur-md rounded-3xl border border-border/50 shadow-2xl">
              <ListItem href="/products?category=Fashion" title="Fashion">
                Premium trends, accessories & curated apparel.
              </ListItem>
              <ListItem href="/products?category=Tech" title="Tech">
                Next-gen gadgets and electronic essentials.
              </ListItem>
              <ListItem href="/products?category=Home" title="Living">
                Minimalist items to elevate your space.
              </ListItem>
              <ListItem href="/products" title="The Vault">
                Browse our entire premium catalog.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent font-black italic uppercase tracking-widest text-[10px] hover:text-primary transition-colors"
            )}
          >
            <Link to="/products">Shop</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent font-black italic uppercase tracking-widest text-[10px] hover:text-primary transition-colors">
            Help
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-4 p-6 md:w-[500px] bg-background/95 backdrop-blur-md rounded-3xl border border-border/50 shadow-2xl">
              <ListItem href="/faq" title="Concierge">
                Help center, shipping, and return policies.
              </ListItem>
              <ListItem href="/product_form" title="Sell with Us">
                Join our elite circle of merchants.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & { href: string; title: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn(
            "group block select-none space-y-2 rounded-2xl p-4 leading-none no-underline outline-none transition-all hover:bg-primary hover:text-primary-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-black italic uppercase tracking-tighter group-hover:translate-x-1 transition-transform">
            {title}
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

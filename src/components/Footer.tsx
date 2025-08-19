export default function Footer() {
  const now = new Date()
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  return (
    <footer className="bg-primary text-primary-foreground text-center py-3 mt-6">
      <div className="text-sm">
        Last updated on {formattedDate} {formattedTime}
      </div>
    </footer>
  )
}

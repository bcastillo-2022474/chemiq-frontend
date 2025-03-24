"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function MemberModal({ isOpen, onClose, member }) {
  if (!member) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogClose onClick={onClose} className="z-10 bg-background/80 backdrop-blur-sm" />

        <div className="grid md:grid-cols-2 w-full">
          <div className="h-full max-h-[250px] md:max-h-none">
            {member.avatar && (
              <div className="w-full h-full md:min-h-[450px]">
                <img
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name || "Member"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="p-3 sm:p-6 flex flex-col">
            <DialogHeader className="mb-2 sm:mb-4">
              <DialogTitle className="text-xl sm:text-2xl">{member.name}</DialogTitle>
              {member.role && <DialogDescription className="text-base sm:text-lg" style={{ color: "black" }}>{member.role}</DialogDescription>}
            </DialogHeader>

            <div className="flex-1 flex flex-col space-y-3 sm:space-y-6 text-sm sm:text-base">
              {member.bio && (
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2" style={{ color: "black" }}>Biografía</h4>
                  <p className="line-clamp-3 md:line-clamp-none" style={{ color: "black" }}>{member.bio}</p>
                </div>
              )}

              {member.contact && (
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2" style={{ color: "black" }}>Contacto</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                    {member.contact.email && (
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground" style={{ color: "black" }}>Email</span>
                        <span className="text-xs sm:text-sm truncate" style={{ color: "black" }}>{member.contact.email}</span>
                      </div>
                    )}
                    {member.contact.phone && (
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground" style={{ color: "black" }}>Teléfono</span>
                        <span className="text-xs sm:text-sm" style={{ color: "black" }}>{member.contact.phone}</span>
                      </div>
                    )}
                    {member.contact.location && (
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground" style={{ color: "black" }}>Ubicación</span>
                        <span className="text-xs sm:text-sm truncate" style={{ color: "black" }}>{member.contact.location}</span>
                      </div>
                    )}
                    {member.contact.website && (
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground" style={{ color: "black" }}>Sitio web</span>
                        <a
                          href={member.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-primary hover:underline truncate"
                        >
                          {member.contact.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {member.details && (
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">Detalles</h4>
                  <div className="grid grid-cols-2 gap-1 sm:gap-2">
                    {Object.entries(member.details).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs text-muted-foreground capitalize">{key}</span>
                        <span className="text-xs sm:text-sm truncate">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="mt-3 sm:mt-6 pt-2 sm:pt-4 border-t">
              <Button size="sm" onClick={onClose} className="text-xs sm:text-sm">
                Cerrar
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MemberModal;

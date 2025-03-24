"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import MemberModal from "./MemberModal"

function MemberCard({ cards }) {
  const [selectedMember, setSelectedMember] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = (member) => {
    setSelectedMember(member)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMember(null)
  }

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center align-center">
        {cards.map((member, index) => (
          <Card
            key={index}
            className="cursor-pointer relative group overflow-hidden"
            onClick={() => handleCardClick(member)}
            style={{ width: "300px", height: "350px" }}
          >
            {member.avatar && (
              <>
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name || "Member"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                  <h3 className="text-white text-xl font-bold mb-2">{member.name}</h3>
                  {member.role && <p className="text-white/80 text-center">{member.role}</p>}
                </div>
              </>
            )}
          </Card>
        ))}
      </div>

      <MemberModal isOpen={isModalOpen} onClose={handleCloseModal} member={selectedMember} />
    </>
  )
}

export default MemberCard;

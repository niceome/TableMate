package com.example.tablemate.service;

import com.example.tablemate.dto.post.*;
import com.example.tablemate.entity.Member;
import com.example.tablemate.entity.Post;
import com.example.tablemate.repository.MemberRepository;
import com.example.tablemate.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    public Long create(PostCreateRequest request) {
        Member member = memberRepository.findById(request.memberId())
                .orElseThrow(() -> new IllegalArgumentException("작성자 없음"));

        Post post = Post.builder()
                .title(request.title())
                .category(request.category())
                .dueTime(request.dueTime())
                .party(request.party())
                .content(request.content())
                .writer(member)
                .build();

        return postRepository.save(post).getId();
    }

    public List<PostSimpleResponse> getAll() {
        return postRepository.findAll()
                .stream()
                .map(PostSimpleResponse::from)
                .toList();
    }

    public PostResponse get(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글 없음"));

        return PostResponse.from(post);
    }
}
